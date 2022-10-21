import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvaToolsHorizontalComponent } from './canva-tools-horizontal.component';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
    declarations: [CanvaToolsHorizontalComponent],
    imports: [
        CommonModule,
        TranslocoModule
    ],
    exports: [CanvaToolsHorizontalComponent]
})
export class CanvasHorizontalModule { }
