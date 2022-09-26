import { Injectable, Type, Injector, Component } from '@angular/core';

import { Note } from '../models/note';
import { NoteComponent } from '../components/note/note.component';
import { CanvaComponent } from '../components/canva/canva.component';

import { OperationControlService } from './operation-control.service';
@Injectable({
  providedIn: 'root'
})
export class NoteControlService {

  public note!: Note; // one note
  public canvaComponent!: CanvaComponent;
  public isEdit: boolean = false; //to check if it is the edit mode. for UI...
  public clickedDOMElementId!: string; //to get the right component when editing

  constructor(private op: OperationControlService) { }

  public addNote(): void {
    //console.log('here we are adding note');
    this.addDraggableNote(NoteComponent, this.note);
    this.op.operations[this.op.actStep] = 'add-note';
  }

  public editNote(editId: string): void {
    //add the new version, after editing
    this.addDraggableNote(NoteComponent, this.note);

    //locate previous component
    const component = this.getComponentById(editId);
    //hide it
    component.instance.isHidden = true;
    this.op.operations[this.op.actStep] = 'edit-note';
  }

  public noteUndo(): void {

    if (this.op.actStep > 0) {
      const operData = this.op.opData[this.op.actStep];
      const operation = this.op.operations[this.op.actStep];

      if (operation === 'add-note') {
        const note = operData;
        note.instance.isHidden = true;

      } else if (operation === 'edit-note') {
        const note = operData;
        note.instance.isHidden = true;
        //get the last edited id;
        const prevEditedId = note.instance.editId;
        const prevEditedNote = this.getComponentById(prevEditedId);
        prevEditedNote.instance.isHidden = false;

      } else if (operation === 'remove-note') {
        const id = operData;
        const note = this.getComponentById(id);
        note.instance.isHidden = false;

      } else if (operation.includes('clear')) {
        this.toggleHidingForAllComponents(false);
      }

      this.op.actStep--;
    }

  }

  public noteRedo(): void {

    if (this.op.actStep < this.op.opData.length - 1) {

      this.op.actStep++;
      const operData = this.op.opData[this.op.actStep];
      const operation = this.op.operations[this.op.actStep];

      if (operation === 'add-note') {
        const note = operData;
        note.instance.isHidden = false;

      } else if (operation === 'edit-note') {
        const note = operData;
        note.instance.isHidden = false;

        //get the last edited id;
        const prevEditedId = note.instance.editId;
        const prevEditedNote = this.getComponentById(prevEditedId);
        prevEditedNote.instance.isHidden = true;

      } else if (operation === 'remove-note') {
        const id = operData;
        const note = this.getComponentById(id);
        note.instance.isHidden = true;

      } else if (operation.includes('clear')) {
        this.toggleHidingForAllComponents(true);

      }
    }
  }

  private addDraggableNote(componentClass: Type<any>, note: Note): void {
    // message: string = "Default message", color: string = 'gold', positionX: number, positionY: number, editId: string = '', id: string = 'noteId0', disabled: boolean = false, dragZone: string = '.outer-canva'
    // Create component dynamically inside the ng-template

    const childComponentRef = this.createNoteComponent(componentClass, note);

    this.op.actStep++;
    //for adding during some undos.
    this.op.actStep < this.op.operations.length - 1 && this.fixOperations(this.op.actStep);
    // Push the component so that we can keep track of which components are created
    this.op.opData[this.op.actStep] = childComponentRef;
    this.op.opDataDimensions[this.op.actStep] = false;
    //allow dragging...
    this.toggleDragging(NoteComponent, false);
  }

  public createNoteComponent(componentClass: Type<any>, note: Note): any {
    const childComponentRef = this.canvaComponent.container.createComponent(componentClass);

    if (childComponentRef) {
      const childComponent = childComponentRef.instance;

      childComponent.type = note.type;
      childComponent.dragZone = note.dragZone;
      childComponent.message = note.message;
      childComponent.color = note.color
      childComponent.positionX = note.positionX;
      childComponent.positionY = note.positionY;
      childComponent.editId = note.editId;
      childComponent.id = note.id;
      childComponent.dragDisabled = note.isDisabled;
    }
    return childComponentRef;
  }

  //return Component by Dom Element Id
  public getComponentById(id: string, components: Array<any> = this.op.opData): any {
    return components.find((component: any) =>
      typeof component === 'object' && component !== null &&
      component.instance.id === id
    );
  }

  //remove Note by DOM Element Id
  public removeNote(id: string, components: Array<any> = this.op.opData): void {
    const component = this.getComponentById(id, this.op.opData);

    component && (component.instance.isHidden = true);
    //remove note, in reality hide note (as it is needed later for redo, undo)
    this.op.actStep++;

    this.op.actStep < this.op.operations.length - 1 && this.fixOperations(this.op.actStep);

    this.op.operations[this.op.actStep] = 'remove-note';
    this.op.opData[this.op.actStep] = component.instance.id;//removed note id
    this.op.opDataDimensions[this.op.actStep] = false;

  }


  private fixOperations(start: number = this.op.actStep, end: number = this.op.opData.length) {
    //specially needed when User starts doing new operations after doing undo 3 times for example
    this.op.opData.splice(start, end - start);
    this.op.opDataDimensions.splice(start, end - start);
    this.op.operations.splice(start, end - start);
  }

  //toggle draggin on and off for components.
  toggleDragging(componentClass: Type<any>, isDraggingDisabled: boolean = true, components: Array<any> = this.op.opData): void {
    // Find the component
    const component = components.find((component: any) => component.instance instanceof componentClass);
    const componentIndex = components.indexOf(component);

    // Disable dragging
    componentIndex !== -1 && components.forEach((el: any) =>
      (typeof el === 'object' && el !== null && el.instance !== undefined) &&
      (el.instance.isDisabled = isDraggingDisabled)
    );
  }



  public getShownComponentsIds(components: Array<any> = this.op.opData): Array<string> {
    const shownIds: Array<string> = [];
    components && components.forEach((el: any) =>
      (typeof el === 'object' && el !== null && el.instance !== undefined) &&
      !el.instance.isHidden && shownIds.push(el.instance.id)
    );
    return shownIds;

  }



  public hideAllComponents(isHidden: boolean = true, components: Array<any> = this.op.opData): void {
    // Hide or Show all componentRef/notes.
    this.toggleHidingForAllComponents(isHidden, components);

    if (isHidden === true) {
      this.op.actStep++;
      this.op.opData[this.op.actStep] = 'hidden';
      this.op.opDataDimensions[this.op.actStep] = false;
      this.op.operations[this.op.actStep] = 'clear-notes';
    }

  }

  public areAllComponentsHidden(components: Array<any> = this.op.opData): boolean {
    return components.some((el: any) =>
      (typeof el === 'object' && el !== null && el.instance !== undefined) &&
      (el.instance.isHidden = true)) || true
  }

  public disableDraggingForAllComponents(isDragDisabled: boolean = true, components: Array<any> = this.op.opData): void {
    components && components.forEach((el: any) => {
      if (typeof el === 'object' && el !== null && el.instance !== undefined) {
        el.instance.isDisabled = isDragDisabled;
        console.log(el.instance.isDisabled);
      }
    }
    );
  }

  public toggleHidingForAllComponents(isHidden: boolean = true, components: Array<any> = this.op.opData): void {
    components && components.forEach((el: any) =>
      (typeof el === 'object' && el !== null && el.instance !== undefined) &&
      (el.instance.isHidden = isHidden)
    );
  }

  public toggleHidingForComponentById(id: string, isHidden: boolean = true, components: Array<any> = this.op.opData): void {
    const component = this.getComponentById(id, components);
    component.instance.isHidden = isHidden;
  }

  ngOnDestroy(): void {
    
  }

  // public resizeScreen(winRatio: number, components: Array<any> = this.op.opData): void {

  //   console.log(this.op.opData)
  //   components && components.forEach((el: any) => {

  //     if (typeof el === 'object' && el !== null && el.instance !== undefined) {
  //       el.instance.positionX = el.instance.positionX * (window.innerWidth / 799);
  //       el.instance.positionY = el.instance.positionY * (window.innerHeight / 831);
  //     }

  //   }
  //   );
  // }
}
