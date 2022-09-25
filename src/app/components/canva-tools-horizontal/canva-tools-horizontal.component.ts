import { Component, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { CanvaFreeDrawingService } from '../../services/canva-free-drawing.service';
import { OperationControlService } from '../../services/operation-control.service';
import { NoteControlService } from '../../services/note-control.service';
import { ActivatedRoute } from '@angular/router';
/* eslint-disable */
// @ts-ignore 

/* eslint-enable */

import { Note } from 'src/app/models/note';
import { Board } from 'src/app/models/board';
import { environment } from 'src/environments/environment';

declare let html2canvas: any;

@Component({
  selector: 'app-canva-tools-horizontal',
  templateUrl: './canva-tools-horizontal.component.html',
  styleUrls: ['./canva-tools-horizontal.component.css']
})
export class CanvaToolsHorizontalComponent implements AfterViewChecked {


  private screenshotDataUrl?: string;

  constructor(private drawingSvc: CanvaFreeDrawingService, private op: OperationControlService, private noteSvc: NoteControlService,
    private route: ActivatedRoute,
    private location: Location) { }

  ngAfterViewChecked(): void {
    const cStep = this.op.actStep;
    const cOperations = this.op.opData;
    // console.log(this.op.visibleNotesIds);
    //console.log(this.op.initialStep);

    this.addClassOnCondition(cStep <= this.op.initialStep, document.getElementsByClassName("undoBtn")[0], "disabled");
    this.removeClassOnCondition(cStep > this.op.initialStep, document.getElementsByClassName("undoBtn")[0], "disabled");
    //redoBtn disabling/enabling
    this.addClassOnCondition(cStep >= cOperations.length - 1, document.getElementsByClassName("redoBtn")[0], "disabled");
    this.removeClassOnCondition(cStep < cOperations.length - 1, document.getElementsByClassName("redoBtn")[0], "disabled");

  }

  private addClassOnCondition(condition: boolean, element: Element, className: string): void {
    (condition) && element.classList.add(className);
  }

  private removeClassOnCondition(condition: boolean, element: Element, className: string): void {
    (condition) && element.classList.remove(className);
  }

  public onUndo(id: string): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (this.op.operations[this.op.actStep] === 'draw') {
      this.drawingSvc.cUndo(canvas);
    } else if (this.op.operations[this.op.actStep].includes('note')) {
      this.noteSvc.noteUndo();
    } else if (this.op.operations[this.op.actStep].includes('clear')) {

      console.log('exception undo');
      let tempDrawStep = this.op.actStep;

      console.log(tempDrawStep);
      //canvas
      while (this.op.operations[tempDrawStep] !== 'draw') { tempDrawStep--; }
      console.log(this.op.operations[tempDrawStep]);
      const canvasPic = new Image();
      canvasPic.src = this.op.opData[tempDrawStep];
      this.drawingSvc.clearCanvas(canvas);

      canvasPic.onload = () => {
        canvas.getContext('2d')!.drawImage(canvasPic, 0, 0, this.op.opDataDimensions[tempDrawStep].width, this.op.opDataDimensions[tempDrawStep].height, 0, 0, canvas.width, canvas.height);
      }

      //notes
      console.log(this.op.opData[this.op.actStep][1]);
      this.op.opData[this.op.actStep][1].forEach((noteId: string) =>
        this.noteSvc.toggleHidingForComponentById(noteId, false, this.op.opData)
      );

      this.op.actStep--;


    }

  }

  public onRedo(id: string): void {

    if (this.op.operations[this.op.actStep + 1] === 'draw') {
      this.drawingSvc.cRedo(document.getElementById(id) as HTMLCanvasElement);
    } else if (this.op.operations[this.op.actStep + 1].includes('note')) {
      this.noteSvc.noteRedo();
    } else if (this.op.operations[this.op.actStep + 1].includes('clear')) {
      console.log('exception redo');
      this.drawingSvc.clearCanvas(document.getElementById(id) as HTMLCanvasElement);
      console.log(this.op.opData[this.op.actStep + 1][1].length);
      this.op.opData[this.op.actStep + 1][1].length !== 0 && this.noteSvc.toggleHidingForAllComponents(true, this.op.opData);

      this.op.actStep++;

    }

  }

  public onClear(id: string): void {
    // maybe I'll need to redo something here.. or add some strange case for redo and undo!
    const canvasEl = document.getElementById(id) as HTMLCanvasElement;

    if (this.op.operations[this.op.actStep] === 'clear') return;


    this.op.visibleNotesIds = this.noteSvc.getShownComponentsIds(this.op.opData);

    if ((this.op.opData.length > 1 && this.noteSvc.areAllComponentsHidden()) || !this.drawingSvc.isCanvasBlank(canvasEl)) {

      this.drawingSvc.clearCanvas(canvasEl);

      this.noteSvc.toggleHidingForAllComponents(true, this.op.opData);

      this.op.actStep++;
      if (this.op.actStep < this.op.opData.length) {
        this.op.opData.length = this.op.actStep;
        this.op.opDataDimensions.length = this.op.actStep;
        this.op.operations.length = this.op.actStep;
      }
      this.op.opData[this.op.actStep] = [canvasEl.toDataURL(), this.op.visibleNotesIds];
      this.op.opDataDimensions[this.op.actStep] = [{ width: canvasEl.width, height: canvasEl.height }, false];
      this.op.operations[this.op.actStep] = 'clear-everything';
    }



  }

  public async onSave(type: string = 'same', opData: Array<any> = this.op.opData, operations: Array<string> = this.op.operations): Promise<void> {

    const oldItems: any = JSON.parse(localStorage.getItem('boardsArray')!) || [];

    console.log(oldItems);

    const lastDrawIndex = operations.lastIndexOf('draw');
    this.op.visibleNotesIds = this.noteSvc.getShownComponentsIds(opData);

    const newBoard: Board = {
      id: oldItems.length,
      title: 'Example Board Name',
      date: new Date().toLocaleDateString(),
      canvasData: this.op.opData[lastDrawIndex],
      canvasDimensions: {
        width: this.op.opDataDimensions[lastDrawIndex].width,
        height: this.op.opDataDimensions[lastDrawIndex].height
      },
      notesData: this.getNotesData(this.op.visibleNotesIds),
      previewImage: await this.getScreenShot()
    };


    const routeId = this.route.snapshot.paramMap.get('id');
    if (type !== 'new' && routeId !== 'new') {

      const foundIdx = oldItems.findIndex((x: Board) => x.id.toString() === routeId);
      newBoard.id = Number(this.route.snapshot.paramMap.get('id'))!;
      oldItems[foundIdx] = newBoard;

    } else if (type === 'new' || routeId === 'new') {
      oldItems.push(newBoard);
      this.location.go(environment.routes.CANVA + `/${(oldItems.length - 1)}`);
    }

    localStorage.setItem('boardsArray', JSON.stringify(oldItems));

  }

  private getNotesData(visibleNotesIds: Array<string> = this.op.visibleNotesIds): Array<Note> {

    const notes: Note[] = [];
    visibleNotesIds && visibleNotesIds.forEach((id: any) => {
      const foundNote = this.noteSvc.getComponentById(id).instance;
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

  //get screenshot as a promise with async/await
  private async getScreenShot(id: string = 'screenshot-area'): Promise<string> {
    const c = document.getElementById(id);
    const canvas = await html2canvas(c);
    const MIME_TYPE = "image/png";
    return canvas.toDataURL(MIME_TYPE);
  }

  private downloadBase64File(contentType: any, base64Data: any, fileName: any): void {
    // this.downloadBase64File('image/png',t.replace("data:image/png;base64,", ""),'image');
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}


