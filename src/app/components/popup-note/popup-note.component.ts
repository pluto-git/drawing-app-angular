import { Component, OnInit, Type, Injector, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { colors } from './colors';
import { CanvaComponent } from '../canva/canva.component';
import { NoteControlService } from '../../services/note-control.service';
import { Note } from '../../models/note';

declare var bootstrap: any;

@Component({
  selector: 'app-popup-note',
  templateUrl: './popup-note.component.html',
  styleUrls: ['./popup-note.component.css'],
})


export class PopupNoteComponent {

  public colors = colors;
  private canvaComponent!: CanvaComponent; // to be injected.
  private id: number = 0;

  constructor(private _injector: Injector, private noteSvc: NoteControlService) {
    this.canvaComponent = this._injector.get<CanvaComponent>(CanvaComponent);
  }

  public form = new FormGroup({
    modalNote: new FormControl('', [Validators.required, Validators.maxLength(50)])
  });

  ngAfterViewInit() {
    this.noteSvc.canvaComponent = this.canvaComponent;

  }

  public onSaveNote(modalId: string, id: string = 'exampleFormControlTextarea1'): void {

    this.noteSvc.isEdit === false && this.handleNote(modalId, id, 'add');
    this.noteSvc.isEdit === true && this.handleNote(modalId, id, 'edit');
  }

  private handleNote(modalId: string, id: string = 'exampleFormControlTextarea1', mode: string = 'add'): void {

    const bgClr = getComputedStyle(<HTMLElement>document.getElementById(id), null).getPropertyValue("background-color");

    this.noteSvc.note = {
      id: 'noteId' + this.id, message: this.form.controls['modalNote'].value!, color: bgClr, positionX: 200, positionY: 200 + 5 * (this.id + 1), editId: '',
      isHidden: false,
      isDisabled: false, dragZone: '.outer-container', type: 'note', dragDisabled: false
    };

    //set the edited note's position if we are in the edit more:
    if (mode === 'edit') {
      const prevNote = this.noteSvc.getComponentById(this.noteSvc.clickedDOMElementId);
      this.noteSvc.note.editId = this.noteSvc.clickedDOMElementId; //needed for undo/redo!
      this.noteSvc.note.positionX = prevNote.instance.positionX;
      this.noteSvc.note.positionY = prevNote.instance.positionY;
    }
    this.id += 1;

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
    foundNoteComponent && this.changeTextareaColor(this.getColorCircleIdByValue(foundNoteComponent.instance.color));
    this.setNoteMessage(foundNoteComponent.instance, modalTextareaId);

  }

  private setNoteMessage(foundNote: any, modalTextareaId: string): void {
    const t = document.getElementById(modalTextareaId)! as HTMLTextAreaElement;
    t.value = foundNote.message;
    this.form.controls['modalNote'].setValue(foundNote.message);
    // this.form.controls['modalNote'].markAsTouched();
    // this.form.controls['modalNote'].markAsDirty();
    // console.log(this.form);
    // this.form.controls['modalNote'].updateValueAndValidity;
    // this.form.markAllAsTouched();

    // this.cd.detectChanges();
    // console.log(this.form.controls['modalNote'].value!);
  }

  private getCurrentId(event: Event): string {
    return (event.target as Element).id;
  }

  public getColorCircleIdByValue(hex: string): string {
    const colorArr = Object.entries(this.colors).map(e => e[1]);
    return colorArr.find(el => el.value === hex)!.id;
  }

  public changeTextareaColor(colorCircleId: string, id: string = 'exampleFormControlTextarea1'): void {
    const color = colors[colorCircleId as keyof typeof colors].value;

    document.getElementById(id)!.style.backgroundColor = color;

    //applying additional styles for not white circles!
    this.hideCircleArrows();
    colorCircleId !== colors.white.id && this.styleColorButton(colorCircleId);
  }

  private hideCircleArrows(): void {
    //add hide to all circle arrows . to be sure.
    const circles = <NodeListOf<Element>>document.querySelectorAll('.modal-color .with-arrow');
    circles && Array.from(circles).forEach(el =>
      el.nextElementSibling!.classList.add('d-none')
    );
  }

  private styleColorButton(circleId: string): void {

    const selectedCircle = <HTMLElement>document.getElementById(circleId);

    //remove a bootstrap class 'd-none' to show element from the next sibling (path).
    //ofc you need to have the structure: <svg> <ellipse [id]='circleId' /> <path class='d-none'/> <svg/>
    selectedCircle.nextElementSibling!.classList.remove('d-none');

  }


  ngOnDestroy(): void {
    //this.noteSvc.isEdit = false;
  }
}
