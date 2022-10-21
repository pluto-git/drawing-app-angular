import { Component, Injector} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { colors } from '../../data-access/colors';
import { NoteControlService } from '../../data-access/services/note-control.service';
import { CanvaComponent } from '../../feature/canvas/canva.component';
import { CircleComponent } from '../circle/circle.component';

declare var bootstrap: any;

@Component({
  selector: 'app-popup-note',
  templateUrl: './popup-note.component.html',
  styleUrls: ['./popup-note.component.scss'],
  providers: [CircleComponent]
})


export class PopupNoteComponent {

  public colors = colors;

  // to be injected.
  private canvaComponent!: CanvaComponent;
  public circleComponent!: CircleComponent;

  constructor(private _injector: Injector, private noteSvc: NoteControlService) {
    this.canvaComponent = this._injector.get<CanvaComponent>(CanvaComponent);
    this.circleComponent = this._injector.get<CircleComponent>(CircleComponent);
  }

  public form = new FormGroup({
    modalNote: new FormControl('', [Validators.required, Validators.maxLength(25)])
  });


  ngAfterViewInit(): void {
    this.noteSvc.canvaComponent = this.canvaComponent;
  }

  onDisabled(): boolean {

    if (this.circleComponent.colorChanged === false) {
      return true;
    } else if (this.form.valid === false) {
      return true;
    }
    else {
      return false;
    }

  }

  public onSaveNote(modalId: string, id: string = 'exampleFormControlTextarea1'): void {

    this.noteSvc.isEdit === false && this.handleNote(modalId, id, 'add');
    this.noteSvc.isEdit === true && this.handleNote(modalId, id, 'edit');

    this.circleComponent.colorChanged = false;
  }

  private handleNote(modalId: string, id: string = 'exampleFormControlTextarea1', mode: string = 'add', canvasId: string = 'canvas'): void {

    const bgClr = getComputedStyle(<HTMLElement>document.getElementById(id), null).getPropertyValue("background-color");

    const canvas = <HTMLCanvasElement>document.getElementById(canvasId);
    this.noteSvc.note = {
      id: 'noteId' + this.noteSvc.noteId, message: this.form.controls['modalNote'].value!, color: bgClr, positionX: 20 + 0.5 * (this.noteSvc.noteId + 1), positionY: 20, editId: '',
      isHidden: false, initialCanvasSize: { width: canvas.offsetWidth, height: canvas.offsetHeight },
      isDisabled: false, dragZone: '.outer-container', type: 'note', dragDisabled: false
    };

    //set the edited note's position if we are in the edit more:
    if (mode === 'edit') {
      const prevNote = this.noteSvc.getComponentById(this.noteSvc.clickedDOMElementId);
      this.noteSvc.note.editId = this.noteSvc.clickedDOMElementId; //needed for undo/redo!
      this.noteSvc.note.positionX = prevNote.instance.positionX;
      this.noteSvc.note.positionY = prevNote.instance.positionY;
    }
    this.noteSvc.noteId += 1;

    //closing modal and changing the cursor
    this.closeModal(modalId, mode);
  }

  public closeModal(modalId: string, mode: string = 'cancel'): void {
    //to close the modal...
    document.getElementById(modalId)!.click();

    //adding note to the screen
    mode === 'add' && this.noteSvc.addNote();
    if (mode === 'edit') {
      // console.log('editttting');
      this.noteSvc.editNote(this.noteSvc.clickedDOMElementId);
    }
    this.noteSvc.isEdit = false;

    //reset the textarea value to empty.
    this.form.controls['modalNote'].setValue('');
    //and change cursor by selecting the previous tool or actually the 'select' tool
    this.canvaComponent.previousTool && this.canvaComponent.selectToolUI(this.canvaComponent.previousTool);
    this.circleComponent.colorChanged = false;
  }

  public editModal(modalId: string, event: Event, modalTextareaId: string = 'exampleFormControlTextarea1'): void {
    //console.log('opening our modal');
    this.noteSvc.isEdit = true;

    //bootstrap thingy to show modal
    const myModal = new bootstrap.Modal(document.getElementById(modalId), {});
    myModal.show();

    //find Note component
    this.noteSvc.clickedDOMElementId = (event.target as Element).id;
    const foundNoteComponent = this.noteSvc.getComponentById(this.noteSvc.clickedDOMElementId);

    // //set color, message in our modal
    foundNoteComponent && this.circleComponent.changeTextareaColor(this.circleComponent.getColorCircleIdByValue(foundNoteComponent.instance.color));
    this.setNoteMessage(foundNoteComponent.instance, modalTextareaId);

  }

  private setNoteMessage(foundNote: any, modalTextareaId: string): void {
    const t = document.getElementById(modalTextareaId)! as HTMLTextAreaElement;
    t.value = foundNote.message;
    this.form.controls['modalNote'].setValue(foundNote.message);
  }

}
