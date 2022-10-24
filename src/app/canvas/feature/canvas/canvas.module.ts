import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasRoutingModule } from './canvas-routing.module';
import { CanvaComponent } from './canva.component';
import { CanvasHorizontalModule } from '../../ui/canva-tools-horizontal/canva-tools-horizontal.module';
import { NavbarModule } from 'src/app/shared/ui/navbar/navbar.module';
import { PopupNoteModule } from '../../ui/popup-note/popup-note.module';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [CanvaComponent],
  imports: [
    CommonModule,
    CanvasRoutingModule,
    CanvasHorizontalModule,
    NavbarModule,
    PopupNoteModule,
    TranslocoRootModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  exports: [CanvaComponent]
})
export class CanvasModule { }
