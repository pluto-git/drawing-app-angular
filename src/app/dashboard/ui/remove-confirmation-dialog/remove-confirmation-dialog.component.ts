import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  id: string,
  isCancel: boolean
}

@Component({
  selector: 'app-remove-confirmation-dialog',
  templateUrl: './remove-confirmation-dialog.component.html',
  styleUrls: ['./remove-confirmation-dialog.component.scss']
})
export class RemoveConfirmationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RemoveConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {

   }

  onCancel(): void {
    //clearing if cancel
    this.data.isCancel = true;
    this.dialogRef.close(this.data);
  }
}
