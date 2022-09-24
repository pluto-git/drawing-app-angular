import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationControlService {

  public operations: Array<string> = []; //draw, add-note, edit-note, remove-note, clear-note
  public opData: Array<any> = []; // will hold data which is related to our operations...
  public opDataDimensions: Array<any> = []; //keeping track of height, width for canvas. or false for other elements.
  public actStep: number = -1; //the current operation step
  public visibleNotesIds: Array<string> = [];// for undo clearing everything.
  public initialStep!: number; //depends if the sata

  constructor() { }



}
