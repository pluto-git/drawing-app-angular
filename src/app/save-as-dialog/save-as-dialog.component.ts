import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  boardName: string,
  status: string
}

@Component({
  selector: 'app-save-as-dialog',
  templateUrl: './save-as-dialog.component.html',
  styleUrls: ['./save-as-dialog.component.css']
})
export class SaveAsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SaveAsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {

    //clearing if cancel
    this.data.status = 'cancel'; 
    this.data.boardName = '';
    this.dialogRef.close(this.data);
  }

}
