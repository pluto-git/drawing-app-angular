import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvaToolsHorizontalComponent } from './canva-tools-horizontal.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
    declarations: [CanvaToolsHorizontalComponent],
    imports: [
        CommonModule,
        TranslocoModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule
    ],
    exports: [CanvaToolsHorizontalComponent]
})
export class CanvasHorizontalModule { }
