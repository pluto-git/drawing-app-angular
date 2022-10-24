import {
  Component, ElementRef, HostListener, ViewChild, ViewContainerRef, ChangeDetectorRef, Injector
} from '@angular/core';
import { cursors } from '../../data-access/cursors';
import { Board } from '../../data-access/models/board';
import { CanvaFreeDrawingService } from '../../data-access/services/canva-free-drawing.service';
import { NoteControlService } from '../../data-access/services/note-control.service';
import { OperationControlService } from '../../data-access/services/operation-control.service';
import { tools } from '../../data-access/tools';
import { NoteComponent } from '../../ui/note/note.component';
import { CanvaToolsHorizontalComponent } from '../../ui/canva-tools-horizontal/canva-tools-horizontal.component';
import { BoardApiService } from '../../data-access/services/board-api.service';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
  providers: [CanvaToolsHorizontalComponent]
})
export class CanvaComponent {

  constructor(private drawingSvc: CanvaFreeDrawingService, private noteSvc: NoteControlService
    , private op: OperationControlService,
    private cd: ChangeDetectorRef,
    private toolComponent: CanvaToolsHorizontalComponent,
    private boardSvc: BoardApiService
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

  private foundBoard!: Board;

  //listening to window resize
  @HostListener("window:resize", [])
  public onResize(): void {
    const debounceTime = 300;// in ms before each resize is counted!

    if (this.resizeTimeout) { clearTimeout(this.resizeTimeout); }
    this.resizeTimeout = setTimeout((() => {
      this.drawingSvc.resizeScreen(this.canvas.nativeElement, this.currentTool);
    }).bind(this), debounceTime);

  }

  public ngOnInit(): void {
    this.ratio = window.devicePixelRatio; //dpi for canvas
    this.op.subsToQueryParams(); //for save
    this.op.isNavigate = true; //for save

    this.noteSvc.noteId = 0;

  }



  public canExit(): boolean {
    console.log(this);
    if (this.op.isLastStepSave === false) {
      this.op.isNavigate = false;
      this.toolComponent.onSave('same', this.op.boardName);
    }
    return true;
  }


  public async ngAfterViewInit(): Promise<void> {

    //setting up dimensions...
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    canvasEl.width = this.canvas.nativeElement.offsetWidth * this.ratio;
    canvasEl.height = this.canvas.nativeElement.offsetHeight * this.ratio;

    const data = await this.findBoard(this.op.queryId);
    this.foundBoard = data.canvasData;

    this.foundBoard && this.uploadSavedData(canvasEl, this.foundBoard);

    if (this.foundBoard) {
      this.op.boardName = this.foundBoard.title;
      this.op.actStep++;
      this.op.opData[this.op.actStep] = this.foundBoard.canvasData;
      this.op.opDataDimensions[this.op.actStep] = { width: this.foundBoard.canvasDimensions.width, height: this.foundBoard.canvasDimensions.height };
      this.op.initialStep = this.op.operations.length;
    }
    //if a new board:
    if (!this.foundBoard) {
      this.drawingSvc.cPush(canvasEl);
      this.op.initialStep = 0;
    }
    //pushing for undo/redo as the above 2 conditions don't add the operation name!
    this.op.operations.push('draw');
    //to not save this state
    this.op.isLastStepSave = true;

    //pick Pen and start drawing... to not make errors with later operations.
    this.pickTool(tools.pen, "canvas");
    //pick the standard tool!
    this.pickTool(tools.select, 'canvas');

    this.cd.detectChanges();

    //important for uploads! as id will be counted from the right one! not 0 
    // if it is 0 then after uploads you can get an undesirable behaviour...
    if (document.getElementsByClassName('note-box').length > 0) {
      Array.from(document.getElementsByClassName('note-box')).forEach((note: any) => {

        const numId = parseInt(note.id.replace(/\D/g, ''));
        if (numId >= this.noteSvc.noteId) { this.noteSvc.noteId = numId + 1 }

      }

      )
    }

  }

  private async findBoard(id: string): Promise<any> {
    return this.boardSvc.getOne(id).toPromise();
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

    //calling methods depending on the conditions
    tool === tools.pen && this.drawingSvc.pickPen(canvas);
    tool === tools.eraser && this.drawingSvc.pickEraser(canvas, 10);
    tool === tools.select && this.drawingSvc.pickSelect();
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
    (this.currentTool === tools.sticker) && (canvasEl.style.cursor = 'auto');

  }

  ngOnDestroy(): void {

    this.op.actStep = -1;
    this.op.opData = [];
    this.op.opDataDimensions = [];
    this.op.operations = [];
    this.op.visibleNotesIds = [];
    this.op.initialStep = -1;
    this.op.isLastStepSave = false;
    this.op.boardName = 'Example Board Name';

    this.drawingSvc.unsubscribeDrawing();
    this.currentTool = '';
    this.previousTool = '';

    ///for our query params
    this.op.idSubs && this.op.unsubToQueryParams();


    this.noteSvc.noteId = 0;
  }

}
