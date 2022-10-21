import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardHomeComponent } from './dashboard-home.component';
import { DashboardHomeRoutingModule } from './dashboard-home-routing.module';

import { RemoveConfirmationDialogModule } from '../../ui/remove-confirmation-dialog/remove-confirmation-dialog.module';
import { TranslocoRootModule } from 'src/app/shared/utils/transloco-root.module';

@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    CommonModule,
    DashboardHomeRoutingModule,
    RemoveConfirmationDialogModule,
    TranslocoRootModule
  ], exports: [DashboardHomeComponent]
})
export class DashboardHomeModule { }
