import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationDialogComponent } from './remove-confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';
@NgModule({
    declarations: [
        RemoveConfirmationDialogComponent
    ],
    imports: [
        CommonModule,
        TranslocoRootModule,
        MatDialogModule,
        MatButtonModule
    ], exports: [RemoveConfirmationDialogComponent]
})
export class RemoveConfirmationDialogModule { }
