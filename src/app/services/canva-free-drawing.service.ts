import { Injectable } from '@angular/core';
import { fromEvent, merge, ObservableInput, Subscription } from 'rxjs';
import { switchMap, pairwise, takeUntil, scan } from 'rxjs/operators';

import { tools } from '.././components/canva/tools';
import { OperationControlService } from './operation-control.service';


interface Position {
  x: number,
  y: number
};

@Injectable({
  providedIn: 'root'
})

export class CanvaFreeDrawingService {

  public cx!: CanvasRenderingContext2D;// context needed to set up drawing
  private ratio = window.devicePixelRatio; //for different screens.
  public currentTool!: string;
  public mainSub!: Subscription; //to draw
  public mouseUpSub!: Subscription; //to push canva states for redo/undo

  constructor(private op: OperationControlService) { }


  //capture events for drawing
  public captureEvents(canvas: HTMLCanvasElement, tool: string): void {
    // this.currentTool = tool;
    // console.log(this.currentTool);
    const mouseDown = merge(
      fromEvent<MouseEvent>(canvas, "mousedown"),
      fromEvent<TouchEvent>(canvas, "touchstart")
    );
    //we don't include mouseLeave and touchLeave for convenience.
    const mouseUp = merge(
      fromEvent<MouseEvent>(canvas, "mouseup"),
      fromEvent<TouchEvent>(canvas, "touchend"),
    );
    const mouseMove = merge(
      fromEvent<MouseEvent>(canvas, "mousemove"),
      fromEvent<TouchEvent>(canvas, "touchmove"),
    );


    if ((tool === tools.pen) || (tool === tools.eraser)) {
      this.DrawingImplementation(canvas, mouseDown, mouseMove, mouseUp);
    } else {
      this.DrawingImplementation(canvas, mouseDown, mouseMove, mouseUp);
    }

    this.mouseUpSub = mouseUp.subscribe(() => {
      this.cPush(canvas);
      //to add 'draw' to an array of operations
      // console.log(this.op.actStep + ' is here');
      this.op.operations[this.op.actStep] = 'draw';
    });

  }
  private fixCanvasSizes(): void {
    const canvases = document.getElementsByTagName("canvas");
    for (var i = 0; i < canvases.length; i++) {
      let canvas = canvases[i];
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }

  private DrawingImplementation(canvas: HTMLCanvasElement, mouseDown: any, mouseMove: any, mouseUp: ObservableInput<any>) {
    this.mainSub = mouseDown
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return mouseMove
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse or leaves the canva
              // this will trigger a 'mouseup' event    
              takeUntil(mouseUp),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point    
              pairwise()
            )
        })
      )
      .subscribe((res: [Event, Event]) => {

        const rect = canvas.getBoundingClientRect();

        //checking if the event contains 'changedTouches' aka it is a touch event:
        const isTouch: boolean = 'changedTouches' in res[0];

        const prevPos = this.getPosition(res[0], isTouch, rect);
        const currentPos = this.getPosition(res[1], isTouch, rect);
        // const prevPos = this.scalePosition(this.getPosition(res[0], isTouch, rect));
        // const currentPos = this.scalePosition(this.getPosition(res[1], isTouch, rect));
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  //drawing on Canvas.
  private drawOnCanvas(
    prevPos: Position,
    currentPos: Position
  ) {
    // incase the context is not set
    if (!this.cx) { return; }

    // start our drawing path
    this.cx.beginPath();

    // we're drawing lines so we need a previous position
    if (prevPos) {
      // sets the start point
      this.cx.moveTo(prevPos.x, prevPos.y); // from

      // draws a line from the start pos until the current position
      this.cx.lineTo(currentPos.x, currentPos.y);

      // strokes the current path with the styles we set earlier
      this.cx.stroke();
    }
  }

  private getPosition(res: any, isTouch: boolean, rect: DOMRect): Position {
    //console.log(rect);
    //returning positions for mouse events.
    if (isTouch === true) {
      //if it is a touch event
      return {
        x: (res.changedTouches[0].clientX - rect.left)* this.ratio as number,
        y: (res.changedTouches[0].clientY - rect.top)*this.ratio as number
      };
    } else {
      //if mouse event:
      return {
        x: (res.clientX - rect.left) * this.ratio as number,
        y: (res.clientY - rect.top) * this.ratio as number
      }
    }

  }

  //Clear Canvas
  public clearCanvas(canvas: HTMLCanvasElement): void {
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }

  //Resizing canvas with not clearing them
  public resizeScreen(canvas: HTMLCanvasElement, currentTool: string): void {

    //creating 2nd/hidden canva to store context from first canva
    const hiddenCnv: HTMLCanvasElement = document.createElement("canvas");
    const hiddenCx: CanvasRenderingContext2D = hiddenCnv.getContext('2d')!;
    //reassinging the main canva for convenience
    const cx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    //setting up dimensions of the hidden canva with counting dpi of the device.
    hiddenCnv.width = canvas.offsetWidth * this.ratio;
    hiddenCnv.height = canvas.offsetHeight * this.ratio;

    //storing old context in the hidden one.
    hiddenCx.imageSmoothingEnabled = false;
    hiddenCx?.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, hiddenCnv.width, hiddenCnv.height);

    //clearing the original canvas because of assigning width and height to the canva
    canvas.width = canvas.offsetWidth * this.ratio;
    canvas.height = canvas.offsetHeight * this.ratio;

    cx.imageSmoothingEnabled = false;
    //redrawing on the original canva after refresh because of the above parts.
    cx.drawImage(hiddenCnv, 0, 0, hiddenCnv.width, hiddenCnv.height, 0, 0, canvas.width, canvas.height);

    //ubsubscribe last subscriptions.
    this.mainSub.unsubscribe();
    this.mouseUpSub.unsubscribe();

    //subscribe latest subs:
    this.captureEvents(canvas, this.currentTool);
    this.getContextFromTools(currentTool, canvas);


    ////////with notes...

    this.op.opData && this.op.opData.forEach((el: any) => {
      const noteComponent = el.instance;
      if ((typeof el === 'object' && el !== null && el.instance !== undefined) &&
        !el.instance.isHidden) {

        //resizing notes -external to canvas objects:

        noteComponent.positionX = canvas.offsetWidth * noteComponent.initialPercX;
        noteComponent.positionY = canvas.offsetHeight * noteComponent.initialPercY;
        // noteComponent.note.nativeElement.style.position = 'absolute';
        noteComponent.note.nativeElement.style.left = noteComponent.positionX + 'px';
        noteComponent.note.nativeElement.style.top = noteComponent.positionY + 'px';

        //new values after done changing...
        noteComponent.initialCanvasX = canvas.offsetWidth;
        noteComponent.initialCanvasY = canvas.offsetHeight;
        noteComponent.initialPercX = noteComponent.positionX / noteComponent.initialCanvasX;
        noteComponent.initialPercY = noteComponent.positionY / noteComponent.initialCanvasY;

      }
    }
    );


    console.log('Resize completed');
  }


  public cPush(canvas: HTMLCanvasElement, maxPushes: number = 10): void {

    this.op.actStep++;
    this.op.opData[this.op.actStep] = canvas.toDataURL();
    this.op.opDataDimensions[this.op.actStep] = { width: canvas.width, height: canvas.height };

    // if (this.op.opData.length > maxPushes) {
    //   this.op.opData.shift();
    //   this.op.opDataDimensions.shift();
    //   this.op.operations.shift();
    //   this.op.actStep--;
    // }

  }


  public uploadCanvas(canvas: HTMLCanvasElement, source: string, canvasWidth: number, canvasHeight: number): void {
    if (!canvas) return;

    const canvasPic = new Image();
    canvasPic.src = source;
    this.clearCanvas(canvas);
    canvasPic.onload = () => {
      const ctx = canvas.getContext('2d');
      ctx!.imageSmoothingEnabled = false;
      ctx!.drawImage(canvasPic, 0, 0, canvasWidth, canvasHeight, 0, 0, canvas.width, canvas.height);
    }

  }

  //Undo operation for canvas drawing
  public cUndo(canvas: HTMLCanvasElement, operation: string = 'draw'): void {

    if (this.op.actStep > 0) {
      this.op.actStep--; // deducting one step;
      const tempIndex = this.op.actStep;
      const prevDrawIndex = this.op.operations.slice(0, tempIndex + 1).lastIndexOf(operation);

      //if no previous drawing done before
      if (prevDrawIndex === -1) {
        return;
      }

      this.uploadCanvas(canvas, this.op.opData[prevDrawIndex], this.op.opDataDimensions[prevDrawIndex].width, this.op.opDataDimensions[prevDrawIndex].height);

    }

  }

  //Redo operation for canvas drawing
  public cRedo(canvas: HTMLCanvasElement): void {

    if (this.op.actStep < this.op.opData.length - 1) {
      this.op.actStep++;

      this.uploadCanvas(canvas, this.op.opData[this.op.actStep], this.op.opDataDimensions[this.op.actStep].width, this.op.opDataDimensions[this.op.actStep].height);
    }

  }

  //returns true if every pixel's uint32 representation is 0 (or "blank")
  //f.e. needed for things like to not clear action more than once.
  public isCanvasBlank(canvas: HTMLCanvasElement): boolean {
    const ctx = canvas.getContext('2d');

    const pixelBuffer = new Uint32Array(
      ctx!.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
  }

  //Start drawing
  public subscribeDrawing(canvas: HTMLCanvasElement, cx: CanvasRenderingContext2D, tool: string): void {
    this.captureEvents(canvas, tool);
    this.cx = cx;
  }

  //Stop drawing
  public unsubscribeDrawing(): void {
    if (this.mainSub || this.mouseUpSub) {
      this.mainSub.unsubscribe();
      this.mouseUpSub.unsubscribe();
      this.currentTool = '';
    }
  }

  //--------------- TOOLS ---------------------------/
  public pickPen(canvas: HTMLCanvasElement, lineWidth: number = 5, lineCap: CanvasLineCap = 'round', colour: string = 'blue'): void {

    this.unsubscribeDrawing();
    const cx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    cx.lineWidth = lineWidth;
    cx.lineCap = lineCap;
    cx.strokeStyle = colour;

    this.subscribeDrawing(canvas, cx, tools.pen);

  }

  //simply pickPen(...) could be used ofc. but for visualization I made this method...
  public pickEraser(canvas: HTMLCanvasElement, lineWidth: number = 10): void {

    this.unsubscribeDrawing();
    const cx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    cx.lineWidth = lineWidth;
    cx.lineCap = 'round';
    cx.strokeStyle = "white";

    this.subscribeDrawing(canvas, cx, tools.eraser);
  }

  //not really needed. but for visualization
  public pickSelect(): void {
    this.unsubscribeDrawing();
  }

  public getContextFromTools(activeTool: string, canvasEl: HTMLCanvasElement): void {

    activeTool === tools.pen && this.pickPen(canvasEl);
    activeTool === tools.eraser && this.pickEraser(canvasEl);
    activeTool === tools.select && this.pickSelect();
    activeTool === tools.sticker && this.unsubscribeDrawing();

  }



  ///---- Other possible functions to implement

  /*
  public pickTextarea(canvasEl: HTMLCanvasElement): void {
    this.unsubscribeDrawing();
    const cx: CanvasRenderingContext2D = canvasEl.getContext('2d')!;
    this.subscribeDrawing(canvasEl, cx, tools.textarea);
  }

  private textareaImplementation(canvasEl: HTMLCanvasElement) {
    // const source = fromEvent(canvasEl, 'click');
    // const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
    // //output (example): 'Event time: 7276.390000000001'
    // const subscribe = example.subscribe(val => console.log(val));
    this.mainSub = fromEvent(canvasEl, 'click').subscribe((res: any) => {
      const rect = canvasEl.getBoundingClientRect();

      //checking if the event contains 'changedTouches' aka it is a touch event:
      const isTouch: boolean = 'changedTouches' in res;

      const pos = this.getPosition(res, isTouch, rect);
      //console.log(pos);
      this.textAreaOnCanvas(canvasEl, pos);

    });
  }

  private textAreaOnCanvas(canvasEl: HTMLCanvasElement, pos: { x: number, y: number }) {
    const t = document.createElement('textarea');
    //t.style.position = 'absolute';
    t.style.width = '30px';
    t.style.height = '30px';


    t.style.position = 'absolute';
    t.style.backgroundColor = 'gold';
    t.style.left = canvasEl.getBoundingClientRect().left! + pos.x + 'px';
    t.style.top = canvasEl.getBoundingClientRect().top! + pos.y + 'px';

    //assuming we have a wrapper with the same dimensions around our canvas:
    canvasEl.parentElement!.appendChild(t);
    console.log(t.getBoundingClientRect());

  }
  */
}
