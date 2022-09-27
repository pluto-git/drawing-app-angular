import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OperationControlService {

  public operations: Array<string> = []; //draw, add-note, edit-note, remove-note, clear-note
  public opData: Array<any> = []; // will hold data which is related to our operations...
  public opDataDimensions: Array<any> = []; //keeping track of height, width for canvas. or false for other elements.
  public actStep: number = -1; //the current operation step
  public visibleNotesIds: Array<string> = [];// for undo clearing everything.
  public initialStep: number = -1; //needed to correctly do undo/redo operations; especially after uploading saved data on the Board!

  public idSubs!: Subscription; // our query params' subs
  public queryId!: string; // our query parameters!

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }



  public subsToQueryParams(): void {
    this.idSubs = this.activatedRoute.queryParams
      .subscribe(params => {
        this.queryId = params['id'];
      }
      );
  }

  public unsubToQueryParams(): void {
    this.idSubs.unsubscribe();
  }


  public getNotesData(visibleNotesIds: Array<string> = this.visibleNotesIds): Array<Note> {

    const notes: Note[] = [];
    visibleNotesIds && visibleNotesIds.forEach((id: any) => {
      const foundNote = this.getComponentById(id).instance;
      foundNote && notes.push({
        id: foundNote.id,
        positionX: foundNote.positionX,
        positionY: foundNote.positionY,
        type: foundNote.type,
        color: foundNote.color,
        message: foundNote.message,
        editId: foundNote.editId,
        isHidden: foundNote.isHidden,
        isDisabled: foundNote.isDisabled,
        dragDisabled: foundNote.dragDisabled,
        dragZone: foundNote.dragZone
      })
    })

    return notes;

  }

  //return Component by Dom Element Id
  private getComponentById(id: string, components: Array<any> = this.opData): any {
    return components.find((component: any) =>
      typeof component === 'object' && component !== null &&
      component.instance.id === id
    );
  }


  // private downloadBase64File(contentType: any, base64Data: any, fileName: any): void {
  //   // this.downloadBase64File('image/png',t.replace("data:image/png;base64,", ""),'image');
  //   const linkSource = `data:${contentType};base64,${base64Data}`;
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = linkSource;
  //   downloadLink.download = fileName;
  //   downloadLink.click();
  // }

}
