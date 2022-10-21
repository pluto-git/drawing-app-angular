import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperComponent } from './wrapper.component';
import { SignInComponent } from '../../ui/auth/sign-in/sign-in.component';
import { SignUpComponent } from '../../ui/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from '../../ui/auth/forgot-password/forgot-password.component';
import { UserPageComponent } from 'src/app/users/feature/user-page/user-page.component';

import { AuthGuard } from '../../data-access/guard/auth.guard';
import { AppRoutes } from '../../data-access/routes';


const routes: Routes = [
  {
    path: '', component: WrapperComponent, children: [
      {
        path: '', redirectTo: "dashboard", pathMatch: 'full'
      },
      {
        path: AppRoutes.dashboard, loadChildren: () =>
          import('../../../dashboard/feature/dashboard-home/dashboard-home.module').then(m => m.DashboardHomeModule)
      },
      {
        path: AppRoutes.about, loadChildren: () =>
          import('../../../about/feature/about/about.module').then(m => m.AboutModule)
      },
      {
        path: AppRoutes.contactUs, loadChildren: () =>
          import('../../../contact-us/feature/contact-us/contact-us.module').then(m => m.ContactUsModule),

      },
      { path: AppRoutes.userPage, component: UserPageComponent, canActivate: [AuthGuard] },
      {
        path: AppRoutes.notFound, loadChildren: () => import('../page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
      },
    ],
  },
  {
    path: AppRoutes.canvas, loadChildren: () => import('../../../canvas/feature/canvas/canvas.module').then(m => m.CanvasModule)
  },
  { path: AppRoutes.login, component: SignInComponent },
  { path: AppRoutes.register, component: SignUpComponent },
  { path: AppRoutes.forgotPassword, component: ForgotPasswordComponent },
  // { path: AppRoutes.verifyEmailAddress, component: VerifyEmailComponent },
  {
    path: '**', redirectTo: AppRoutes.notFound
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrapperRoutingModule { }
