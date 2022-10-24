import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateCanvaService } from '../../data-access/services/can-deactivate-canva.service';
import { CanvaComponent } from './canva.component';

const routes: Routes = [

  { path: '', component: CanvaComponent, canDeactivate: [CanDeactivateCanvaService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanvasRoutingModule { }
