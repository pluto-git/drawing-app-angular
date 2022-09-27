import {
  Component, Type, ElementRef, HostListener, ViewChild, ViewContainerRef, ChangeDetectorRef
} from '@angular/core';


import { CanvaFreeDrawingService } from '../../services/canva-free-drawing.service';
import { tools } from './tools';
import { cursors } from './cursors';
import { NoteComponent } from '../note/note.component';
import { NoteControlService } from '../../services/note-control.service';
import { OperationControlService } from '../../services/operation-control.service';

import { Board } from 'src/app/models/board';
import { ActivatedRoute } from '@angular/router';
import { CanvaToolsHorizontalComponent } from '../canva-tools-horizontal/canva-tools-horizontal.component';

// import { browserRefresh } from '../app/app.component';


// declare var bootstrap: any;

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.css'],
  providers: [CanvaToolsHorizontalComponent]
})
export class CanvaComponent {

  constructor(private drawingSvc: CanvaFreeDrawingService, private noteSvc: NoteControlService, private op: OperationControlService,
    private route: ActivatedRoute, private cd: ChangeDetectorRef,
    private toolComponent: CanvaToolsHorizontalComponent,
  ) {

  }

  // Expose classes so that it can be used in the template
  draggableComponentClass = NoteComponent;

  @ViewChild('canvas') public canvas!: ElementRef;
  //a container to drop draggable notes as Components to the canva.
  @ViewChild('container', { read: ViewContainerRef }) public container!: ViewContainerRef;

  public tools = tools; //our all tools.
  private ratio!: number; // device pixel ratio.
  public currentTool!: string;// selected tool
  public previousTool!: string; // previous selected tool (for stickers);
  private resizeTimeout!: ReturnType<typeof setTimeout>; //for resizing.
  private id!: string | null; //url param


  // @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  //   console.log("Processing beforeunload...");
  //   event.preventDefault();
  //   this.toolComponent.onSave();
  //   event.returnValue = false;
  // }

  //listening to window resize
  @HostListener("window:resize", [])
  public onResize(): void {
    const debounceTime = 300;// in ms before each resize is counted!

    if (this.resizeTimeout) { clearTimeout(this.resizeTimeout); }
    this.resizeTimeout = setTimeout((() => {
      this.drawingSvc.resizeScreen(this.canvas.nativeElement, this.currentTool);
      //this.noteSvc.resizeScreen(this.ratio);
    }).bind(this), debounceTime);

  }

  public ngOnInit(): void {
    //for dpi
    this.ratio = window.devicePixelRatio;
    this.id = this.route.snapshot.paramMap.get('id');

  }

  canExit(): boolean {
    this.toolComponent.onSave();
    return true;
  }


  public ngAfterViewInit(): void {
    // console.log("ngAfterViewInit in CanvasComponent fired!!!");

    //setting up dimensions...
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    canvasEl.width = this.canvas.nativeElement.offsetWidth * this.ratio;
    canvasEl.height = this.canvas.nativeElement.offsetHeight * this.ratio;

    //finding an item in array

    const foundBoard = this.findBoard(Number(this.id));
    foundBoard && this.uploadSavedData(canvasEl, foundBoard);
    //console.log(foundBoard);

    //pushing for undo/redo

    this.op.operations.push('draw');

    if (foundBoard) {
      this.op.actStep++;
      this.op.opData[this.op.actStep] = foundBoard.canvasData;
      this.op.opDataDimensions[this.op.actStep] = { width: foundBoard.canvasDimensions.width, height: foundBoard.canvasDimensions.height };
      this.op.initialStep = this.op.operations.length - 1;
    }
    //pick Pen and start drawing...
    this.pickTool(tools.pen, "canvas");

    //if a new board:
    if (!foundBoard) {
      this.drawingSvc.cPush(canvasEl);
      this.op.initialStep = 0;
    }
  }

  private findBoard(id: number): Board | undefined {
    const oldItems: Array<any> = JSON.parse(localStorage.getItem('boardsArray')!) || [];
    const foundBoard = oldItems.find(el => el.id === id);

    if (foundBoard === undefined) return;

    return foundBoard;
  }

  public uploadSavedData(canvas: HTMLCanvasElement, foundBoard: Board): void {
    if (!canvas) return;

    this.drawingSvc.uploadCanvas(canvas, foundBoard.canvasData, foundBoard.canvasDimensions.width, foundBoard.canvasDimensions.height);

    foundBoard.notesData.forEach(note => {
      if (note) {
        this.noteSvc.note = note;
        this.noteSvc.addNote();
      }
    });
    this.cd.detectChanges();

  }


  public pickTool(selectedTool: string, id: string = 'canvas'): void {

    if (Object.values(tools).indexOf(selectedTool) === -1) {
      console.log('a wrong tool');
      return;
    }

    this.currentTool = selectedTool;
    const canvasEl = document.getElementById(id) as HTMLCanvasElement;
    //call drawing method...
    this.callDrawingMethod(selectedTool, canvasEl);
    //and add highlighting
    this.selectToolUI(selectedTool, canvasEl);
  }

  private callDrawingMethod(tool: string, canvas: HTMLCanvasElement): void {

    console.log(this.op.opData);
    //calling methods depending on the conditions
    tool === tools.pen && this.drawingSvc.pickPen(canvas);
    tool === tools.eraser && this.drawingSvc.pickEraser(canvas, 10);
    tool === tools.select && this.drawingSvc.pickSelect();
    //for textarea we'll implement later.
    //tool == tools.textarea && this.drawingSvc.pickTextarea(canvas);
    tool === tools.sticker && this.drawingSvc.unsubscribeDrawing();

  }

  public selectToolUI(className: string = tools.pen, canvasEl: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement): void {

    //make
    if (className === tools.sticker) {
      this.previousTool = tools.select;
      //console.log(this.previousTool);
      this.callDrawingMethod(this.previousTool, canvasEl);
      this.currentTool = tools.select;
    }
    this.removeClassFromHTMLCollection(<HTMLCollectionOf<Element>>document.getElementsByClassName('tool'), 'selected');

    //add the needed selection depending on the className
    document.getElementsByClassName(className)[0].children[0].classList.add('selected');

    //set tool cursor
    this.setCursor(canvasEl);

    // (className === tools.select) && this.onSelectBehaviour(NoteComponent, false);
    // (className !== tools.select) && this.onSelectBehaviour(NoteComponent, true);
  }

  private onSelectBehaviour(component: Type<any>, disableDraggingCursor: boolean = false): void {

    //this.noteSvc.toggleDragging(component, disableDragging);
    // this.noteSvc.disableDraggingForAllComponents(disableDragging);

  }


  public removeClassFromHTMLCollection(collection: HTMLCollectionOf<Element>, removedClass: string): void {

    collection && Array.from(collection).forEach(el =>
      el.classList.remove(removedClass)
    );
  }

  private setCursor(canvasEl: HTMLCanvasElement): void {
    canvasEl.style.cursor = 'auto';
    (this.currentTool === tools.pen) && (canvasEl.style.cursor = cursors.pen);
    (this.currentTool === tools.eraser) && (canvasEl.style.cursor = cursors.eraser);
    (this.currentTool === tools.select) && (canvasEl.style.cursor = cursors.select);
    (this.currentTool === tools.textarea) && (canvasEl.style.cursor = cursors.text);
    (this.currentTool === tools.sticker) && (canvasEl.style.cursor = 'auto');

  }






  ngOnDestroy(): void {

    this.op.actStep = -1;
    this.op.opData = [];
    this.op.opDataDimensions = [];
    this.op.operations = [];
    this.op.visibleNotesIds = [];
    this.op.initialStep = -1;
    this.op.isLastSave = true;
    this.drawingSvc.unsubscribeDrawing();
    this.currentTool = '';
    this.previousTool = '';

  }
}
