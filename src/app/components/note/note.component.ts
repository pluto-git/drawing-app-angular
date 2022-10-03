import { Component, AfterViewInit, ViewChild, ElementRef, Injector, ChangeDetectorRef } from '@angular/core';
import { PopupNoteComponent } from '../popup-note/popup-note.component';
import { NoteControlService } from '../../services/note-control.service';
import { CanvaComponent } from '../canva/canva.component';
import { tools } from '../canva/tools';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { OperationControlService } from '../../services/operation-control.service';
import { Note } from 'src/app/models/note';

declare let textFit: any;

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css'],
  providers: [PopupNoteComponent]
})

export class NoteComponent implements AfterViewInit, Note {


  //Note interface properties:
  public type: string = "note";
  public id!: string;
  public dragZone: string = ".outer-container"; //draging zone for our component
  public message: string = "Works!";
  public color: string = "gold";
  public positionX!: number;
  public positionY!: number;
  public initialCanvasX!: number;
  public initialCanvasY!: number;
  public initialPercX!: number;
  public initialPercY!: number;
  public isHidden: boolean = false;
  public dragDisabled!: boolean;
  public lastRelativeCoordinates?: { x: number; y: number; }[];

  //a popup component instance that we inject via Constructor
  public popupNoteComponent!: PopupNoteComponent;

  //-- for starting positioning.
  public position = 'absolute';
  public initialPosition!: { x: number, y: number };
  //-- to move elements correctly.. using Drag & drop Material CDK
  public coordStep: number = 0; // to save dragging operations for redo/undo...
  public dragPosition: { x: number, y: number } = { x: 0, y: 0 };

  //our element.
  @ViewChild('note') public note!: ElementRef;

  constructor(private _injector: Injector, private noteSVC: NoteControlService, private cd: ChangeDetectorRef, private canvaComponent: CanvaComponent, private op: OperationControlService) {
    this.popupNoteComponent = this._injector.get<PopupNoteComponent>(PopupNoteComponent);
  }

  ngOnInit(): void {
    //setting up our initial positions...
    this.initialPosition = { x: this.positionX, y: this.positionY };
  }

  ngAfterViewInit(): void {


    const note = this.note.nativeElement;
    const canvas = <HTMLCanvasElement>document.getElementById('canvas');
    note.style.backgroundColor = this.color;

    //because of resizing...
    if (this.initialCanvasX !== undefined && this.initialCanvasY !== undefined && this.initialPercX !== undefined && this.initialPercY !== undefined) {
      this.positionX = this.initialPercX * canvas.offsetWidth;
      this.positionY = this.initialPercY * canvas.offsetHeight;
    }
    this.initialCanvasX = canvas.offsetWidth;
    this.initialCanvasY = canvas.offsetHeight;
    this.initialPercX = this.positionX / this.initialCanvasX;
    this.initialPercY = this.positionY / this.initialCanvasY;

    //this.fitText(note.id);

  }

  ngAfterViewChecked(): void {

    this.setUIBehaviour();


    const note = this.note.nativeElement;
    this.isHidden ? note.style.display = 'none' : note.style.display = 'flex';
    console.log(this.op.opData);
    console.log(this.op.operations);

  }

  public dragEnd($event: CdkDragEnd): void {
    // as we ending dragEnd we update positions' information:

    const relativePos = $event.source.getFreeDragPosition();
    this.positionX = parseFloat(this.note.nativeElement.style.left) + relativePos.x;
    this.positionY = parseFloat(this.note.nativeElement.style.top) + relativePos.y;
    this.dragPosition = { x: relativePos.x, y: relativePos.y }; //for programm. positioning
    this.updateNoteDimensions({ x: relativePos.x, y: relativePos.y });

  }

  private updateNoteDimensions(relativePos: { x: number, y: number }): boolean {

    const currentNoteId = this.note.nativeElement.id;
    const idx = this.op.opData.findIndex((component: any) =>
      typeof component === 'object' && component !== null &&
      component.instance.id === currentNoteId
    );
    if (idx === -1) { return false; }

    //if the note is found:
    this.op.opData[idx].instance.positionX = this.positionX;
    this.op.opData[idx].instance.positionY = this.positionY;
    this.coordStep++; //to increase for next pushes.

    //for undo, redo..
    this.op.opData[idx].instance.lastRelativeCoordinates[this.coordStep] = ({ x: relativePos.x, y: relativePos.y });
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

  removeMe(event: Event): void {


    //removing this note
    const target = event.target as Element;
    //assuming the id right in the parent element!
    const id = target.parentElement!.id;

    if (id === undefined) { return; }

    this.noteSVC.removeNote(id);


  }

  //returning one step back
  moveToPrevPos(): void {

    if (this.coordStep < 1) return;

    //if the prev position exists:
    const prevRelCoordinates = this.lastRelativeCoordinates![this.coordStep];
    //change coordinates for pure info...
    this.positionX -= prevRelCoordinates.x;
    this.positionY -= prevRelCoordinates.y;

    //actually going one operation back
    this.dragPosition = { x: this.lastRelativeCoordinates![this.coordStep - 1].x, y: this.lastRelativeCoordinates![this.coordStep - 1].y };

    this.coordStep -= 1;
  }

  //move one step ahead. simillar to the previous one,
  //could have written for one method but that d decrease readability with *(-1) on condition.
  moveToNextPos(): void {

    if (!this.lastRelativeCoordinates![this.coordStep + 1]) { return; }

    //if the next positon exists:
    const nextRelCoordinates = this.lastRelativeCoordinates![this.coordStep + 1];
    //change coordinates for pure info...
    this.positionX += nextRelCoordinates.x;
    this.positionY += nextRelCoordinates.y;
    this.dragPosition = { x: this.lastRelativeCoordinates![this.coordStep + 1].x, y: this.lastRelativeCoordinates![this.coordStep + 1].y };

    this.coordStep += 1;
  }


}
