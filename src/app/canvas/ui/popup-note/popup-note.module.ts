import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupNoteComponent } from './popup-note.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';
import { CircleModule } from '../circle/circle.module';


@NgModule({
    declarations: [PopupNoteComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DragDropModule,
        TranslocoRootModule,
        CircleModule
    ],
    exports: [PopupNoteComponent]
})
export class PopupNoteModule { }
