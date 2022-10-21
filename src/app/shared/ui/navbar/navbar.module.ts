import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';

import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoRootModule } from '../../utils/transloco-root.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslocoRootModule,
    MatTooltipModule,
    MatButtonModule
  ],
  exports: [NavbarComponent],
})

export class NavbarModule { }