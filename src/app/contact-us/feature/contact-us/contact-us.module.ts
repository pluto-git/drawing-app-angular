import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsComponent } from './contact-us.component';
import { ContactUsRoutingModule } from './contact-us-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';


@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    TranslocoRootModule,
    ReactiveFormsModule
  ],
  exports: [
    ContactUsComponent
  ]
})
export class ContactUsModule { }
