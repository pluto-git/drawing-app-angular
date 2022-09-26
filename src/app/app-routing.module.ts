import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CanvaComponent } from './components/canva/canva.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

import { environment } from 'src/environments/environment';
// import { CanDeactivateGuard } from './can-deactivate.guard';
import { CanDeactivateCanvaService } from './services/can-deactivate-canva.service';
import { CanDeactivateFormService } from './services/can-deactivate-form.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/' + environment.routes.DASHBOARD, pathMatch: 'full' },
      { path: environment.routes.DASHBOARD, component: DashboardComponent },
      { path: environment.routes.ABOUT, component: AboutComponent },
      { path: environment.routes.CONTACT, component: ContactUsComponent, canDeactivate: [CanDeactivateFormService] }
    ], component: HomeComponent
  },
  { path: environment.routes.CANVA + '/:id', component: CanvaComponent, canDeactivate: [CanDeactivateCanvaService] },
  // { path: ROUTES.DRAWINGBOARD, component: SvgDrawingSheetComponent },
  { path: '**', component: PageNotFoundComponent }

];


@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
