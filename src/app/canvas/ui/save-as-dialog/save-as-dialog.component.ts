import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';

export interface DialogData {
  boardName: string,
  status: string
}

@Component({
  selector: 'app-save-as-dialog',
  templateUrl: './save-as-dialog.component.html',
  styleUrls: ['./save-as-dialog.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatDialogModule, TranslocoRootModule, MatButtonModule]
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
