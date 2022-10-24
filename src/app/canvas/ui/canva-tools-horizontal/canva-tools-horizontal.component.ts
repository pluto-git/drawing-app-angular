import { Component, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
/* eslint-disable */
// @ts-ignore 

/* eslint-enable */
declare let html2canvas: any; // a js lib to make screenshots.

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CanvaFreeDrawingService } from '../../data-access/services/canva-free-drawing.service';
import { OperationControlService } from '../../data-access/services/operation-control.service';
import { NoteControlService } from '../../data-access/services/note-control.service';
import { Board } from '../../data-access/models/board';
import { AppRoutes } from 'src/app/shared/data-access/routes';
import { SaveAsDialogComponent } from '../save-as-dialog/save-as-dialog.component';
import { BoardApiService } from '../../data-access/services/board-api.service';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-canva-tools-horizontal',
  templateUrl: './canva-tools-horizontal.component.html',
  styleUrls: ['./canva-tools-horizontal.component.scss']
})
export class CanvaToolsHorizontalComponent implements AfterViewChecked {

  constructor(private drawingSvc: CanvaFreeDrawingService, private op: OperationControlService, private noteSvc: NoteControlService,
    private router: Router, private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private boardSvc: BoardApiService,
    public aFA: AngularFireAuth
  ) {
  }

  ngAfterViewChecked(): void {
    const cStep = this.op.actStep;

    const cOperations = this.op.opData;
    //undoBtn disabling/enabling
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SaveAsDialogComponent, {
      width: '250px',
      data: { boardName: '', status: '' },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result.status !== 'cancel') {
        this.op.boardName = result.boardName;
        this.onSaveBtn('new', this.op.boardName);
      }

    });

  }

  public getBoardName(): string {
    return this.op.boardName;
  }

  public onUndo(id: string): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (this.op.operations[this.op.actStep] === 'draw') {
      this.drawingSvc.cUndo(canvas);
    } else if (this.op.operations[this.op.actStep].includes('note')) {
      this.noteSvc.noteUndo();
    } else if (this.op.operations[this.op.actStep].includes('clear')) {

      // console.log('exception undo');
      let tempDrawStep = this.op.actStep;

      // console.log(tempDrawStep);
      //canvas
      while (this.op.operations[tempDrawStep] !== 'draw') { tempDrawStep--; }
      //console.log(this.op.operations[tempDrawStep]);
      const canvasPic = new Image();
      canvasPic.src = this.op.opData[tempDrawStep];
      this.drawingSvc.clearCanvas(canvas);

      canvasPic.onload = () => {
        canvas.getContext('2d')!.drawImage(canvasPic, 0, 0, this.op.opDataDimensions[tempDrawStep].width, this.op.opDataDimensions[tempDrawStep].height, 0, 0, canvas.width, canvas.height);
      }

      //notes
      //console.log(this.op.opData[this.op.actStep][1]);
      this.op.opData[this.op.actStep][1].forEach((noteId: string) =>
        this.noteSvc.toggleHidingForComponentById(noteId, false, this.op.opData)
      );

      this.op.actStep--;
    } else if (this.op.operations[this.op.actStep].includes('drag')) {

      const componentRef = this.op.getComponentById(this.op.opData[this.op.actStep]);
      componentRef.instance.moveToPrevPos();

      this.op.actStep--;
    }

  }

  public onRedo(id: string): void {

    if (this.op.operations[this.op.actStep + 1] === 'draw') {
      this.drawingSvc.cRedo(document.getElementById(id) as HTMLCanvasElement);
    } else if (this.op.operations[this.op.actStep + 1].includes('note')) {
      this.noteSvc.noteRedo();
    } else if (this.op.operations[this.op.actStep + 1].includes('clear')) {

      // console.log('exception redo');
      this.drawingSvc.clearCanvas(document.getElementById(id) as HTMLCanvasElement);
      // console.log(this.op.opData[this.op.actStep + 1][1].length);
      this.op.opData[this.op.actStep + 1][1].length !== 0 && this.noteSvc.toggleHidingForAllComponents(true, this.op.opData);

      this.op.actStep++;

    } else if (this.op.operations[this.op.actStep + 1].includes('drag')) {

      const componentRef = this.op.getComponentById(this.op.opData[this.op.actStep + 1]);
      componentRef.instance.moveToNextPos();

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
      //for saves
      this.op.isLastStepSave = false;
    }

  }

  public onSaveBtn(type: string = 'same', boardName: string = 'Example Board Name'): void {
    this.op.isNavigate = true;
    this.onSave(type, boardName);
    this.openSnackBar('Saved successfully!', 'Dismiss');
  }

  public async onSave(type: string = 'same', boardName: string = 'Example Board Name', opData: Array<any> = this.op.opData, operations: Array<string> = this.op.operations): Promise<void> {

    const lastDrawIndex = operations.lastIndexOf('draw');
    this.op.visibleNotesIds = this.noteSvc.getShownComponentsIds(opData);

    const newBoard: Board = {
      id: JSON.parse(localStorage.getItem('user')!).uid + Date.now(),
      title: boardName,
      date: new Date().toLocaleDateString(),
      canvasData: this.op.opData[lastDrawIndex],
      canvasDimensions: {
        width: this.op.opDataDimensions[lastDrawIndex].width,
        height: this.op.opDataDimensions[lastDrawIndex].height
      },
      notesData: this.op.getNotesData(this.op.visibleNotesIds),
      previewImage: await this.getScreenShot()
    };

    //if we save the same or new
    if (type !== 'new' && this.op.queryId !== 'new') {

      newBoard.id = this.op.queryId;
      this.updateBoardInDb(newBoard.id, { canvasData: newBoard })

    }
    if (type === 'new' || this.op.queryId === 'new') {

      if (this.op.isNavigate === true) {

    
        const uid = JSON.parse(localStorage.getItem('user')!).uid;
        console.log(uid);
        this.saveBoardToDb({
          id: newBoard.id,
          canvasData: newBoard,
          uid: uid
        })

        console.log(newBoard.id);
        //change browser location
        this.router.navigate([AppRoutes.canvas], { queryParams: { id: newBoard.id } });
      }
    }




    this.op.isLastStepSave = true;

  }

  private updateBoardInDb(id: string, data: { canvasData: Board; }): void {

    this.boardSvc.update(id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => console.error(e)
      });
  }

  private saveBoardToDb(data: {
    id: string,
    canvasData: Board;
    uid: string
  }): void {

    this.boardSvc.create(data)
      .subscribe({
        next: (data) => { console.log(data) },
        error: (e: Event) => console.error(e)
      });
  }

  private async getScreenShot(id: string = 'screenshot-area'): Promise<string> {

    const c = document.getElementById(id);
    const canvas = await html2canvas(c, { scale: "3" });
    const MIME_TYPE = "image/png";
    return canvas.toDataURL(MIME_TYPE);

  }

  public async onDownload(): Promise<void> {

    const image = await this.getScreenShot();
    const a = <HTMLAnchorElement>document.createElement('a');
    a.setAttribute('download', 'my-image.png');
    a.setAttribute('href', image);
    a.click();

  }




}


