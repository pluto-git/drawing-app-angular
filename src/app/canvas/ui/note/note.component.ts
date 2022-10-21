import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, OnInit, Injector, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';
import { NoteControlService } from '../../data-access/services/note-control.service';
import { OperationControlService } from '../../data-access/services/operation-control.service';
import { tools } from '../../data-access/tools';
import { CanvaComponent } from '../../feature/canvas/canva.component';
import { PopupNoteComponent } from '../popup-note/popup-note.component';
import { CircleComponent } from '../circle/circle.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, DragDropModule, TranslocoRootModule],
  providers: [PopupNoteComponent, CircleComponent]
})
export class NoteComponent implements OnInit {

  //Note interface properties:
  public type: string = "note";
  public id!: string;
  public dragZone: string = ".outer-container"; //draging zone for our component
  public message: string = "Works!";
  public color: string = "gold";
  public positionX!: number;
  public positionY!: number;

  public isHidden: boolean = false;
  public dragDisabled!: boolean;
  public lastOffsetCoordinates!: { x: number; y: number; }[] | undefined;
  public lastCanvasSize?: { width: number; height: number; }[] | undefined;
  public lastPositions?: { x: number; y: number; }[] | undefined;
  public initialCanvasSize!: { width: number; height: number };

  //a popup component instance that we inject via Constructor
  public popupNoteComponent!: PopupNoteComponent;

  //-- for starting positioning.
  public position = 'absolute';
  //-- to move elements correctly.. using Drag & drop Material CDK
  public coordStep: number = 0; // to save dragging operations for redo/undo...
  public dragPosition: { x: number, y: number } = { x: 0, y: 0 };


  //our element.
  @ViewChild('note') public note!: ElementRef;

  constructor(private _injector: Injector, private noteSVC: NoteControlService,
    private cd: ChangeDetectorRef, private canvaComponent: CanvaComponent,
    private op: OperationControlService) {
    this.popupNoteComponent = this._injector.get<PopupNoteComponent>(PopupNoteComponent);
  }

  ngOnInit(): void {
    //setting up our initial positions...

  }

  ngAfterViewInit(): void {

    const note = this.note.nativeElement;

    note.style.backgroundColor = this.color;
    this.note.nativeElement.style.setProperty('--leftPos', this.positionX + "%");
    this.note.nativeElement.style.setProperty('--topPos', this.positionY + "%");

    this.cd.detectChanges();
  }

  ngAfterViewChecked(): void {

    this.setUIBehaviour();
    const note = this.note.nativeElement;
    this.isHidden ? note.style.display = 'none' : note.style.display = 'flex';

  }


  public getAbsoluteNotePosition(canvasId: string = 'canvas'): { left: number, top: number } {
    //return note positions in PIXELS!
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    const left = this.note.nativeElement.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
    const top = this.note.nativeElement.getBoundingClientRect().top - canvas.getBoundingClientRect().top;
    return { left: left, top: top }
  }

  public dragEnd($event: CdkDragEnd): void {
    // as we ending dragEnd we update positions' information:

    //offset position from the dragS
    const relativePos = $event.source.getFreeDragPosition();
    //our note pos after the drag
    const absolutePosition = this.getAbsoluteNotePosition('canvas');

    this.dragPosition = { x: relativePos.x, y: relativePos.y }; //for programm. positioning
    this.updateNoteDimensions({ x: relativePos.x, y: relativePos.y }, absolutePosition);

  }

  private updateNoteDimensions(relativePos: { x: number, y: number },
    absolutePos: { left: number, top: number }, canvasId: string = 'canvas'): boolean {

    const canvas = <HTMLCanvasElement>document.getElementById(canvasId);

    const currentNoteId = this.note.nativeElement.id;
    const idx = this.op.opData.findIndex((component: any) =>
      typeof component === 'object' && component !== null &&
      component.instance.id === currentNoteId
    );
    if (idx === -1) { return false; }

    //if the note is found:

    //converting positions to percents!
    this.positionX = <number>absolutePos.left / canvas.offsetWidth * 100;
    this.positionY = <number>absolutePos.top / canvas.offsetHeight * 100;

    this.op.opData[idx].instance.positionX = this.positionX;
    this.op.opData[idx].instance.positionY = this.positionY;

    this.coordStep++; //to increase for next pushes.
    //for undo, redo.. + to calculate our positions less, (to have more precision)
    this.op.opData[idx].instance.lastCanvasSize[this.coordStep] = ({ width: canvas.offsetWidth, height: canvas.offsetHeight });
    this.op.opData[idx].instance.lastOffsetCoordinates[this.coordStep] = ({ x: relativePos.x, y: relativePos.y });
    this.op.opData[idx].instance.lastPositions[this.coordStep] = ({ x: this.positionX, y: this.positionY });


    //adding our operation to the arrays for undo/redo..
    this.op.addOperation('drag', this.id, false);

    return true;

  }


  private setUIBehaviour(): void {

    if (this.canvaComponent.currentTool !== tools.select) {
      this.dragDisabled = true;
      this.note.nativeElement.classList.remove('dragging-cursor');
    } else {
      this.dragDisabled = false;
      this.note.nativeElement.classList.add('dragging-cursor');
    }

    this.cd.detectChanges();
  }

  public removeMe(event: Event): void {
    //it doesn't work with display 'flex'; so we re removing it during the method exec.
    //removing this note
    const target = event.target as Element;
    //get our id to remove... check .html file for this component

    const id = "noteId" + target.id.replace(/[^0-9]/g, '');
    // console.log(id);
    if (id === undefined) { return; }

    this.noteSVC.removeNote(id);


  }

  //returning one step back
  public moveToPrevPos(): void {

    if (this.coordStep < 1) return;


    //change coordinates for pure info...
    this.positionX = this.lastPositions![this.coordStep - 1].x;
    this.positionY = this.lastPositions![this.coordStep - 1].y;


    this.dragPosition = { x: this.lastOffsetCoordinates![this.coordStep - 1].x, y: this.lastOffsetCoordinates![this.coordStep - 1].y };

    this.coordStep -= 1;
  }

  //move one step ahead. simillar to the previous one,
  //could have written for one method but that d decrease readability with *(-1) on condition.
  public moveToNextPos(): void {

    if (!this.lastOffsetCoordinates![this.coordStep + 1]) { return; }

    //change coordinates for pure info...
    this.positionX = this.lastPositions![this.coordStep + 1].x;
    this.positionY = this.lastPositions![this.coordStep + 1].y;

    //actually going one operation back
    this.dragPosition = { x: this.lastOffsetCoordinates![this.coordStep + 1].x, y: this.lastOffsetCoordinates![this.coordStep + 1].y };

    this.coordStep += 1;
  }

}
