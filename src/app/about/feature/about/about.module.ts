import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { AboutRoutingModule } from './about-routing.module';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';


@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    TranslocoRootModule
  ],
  exports: [
    AboutComponent
  ]
})
export class AboutModule { }
