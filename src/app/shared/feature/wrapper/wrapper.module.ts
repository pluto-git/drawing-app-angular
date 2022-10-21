import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrapperRoutingModule } from './wrapper-routing.module';
import { WrapperComponent } from './wrapper.component';
import { FootbarModule } from '../../ui/footbar/footbar.module';
import { NavbarModule } from '../../ui/navbar/navbar.module';
import { AuthModule } from '../../ui/auth/auth.module';
import { UserPageModule } from 'src/app/users/feature/user-page/user-page.module';


@NgModule({
  declarations: [
    WrapperComponent
  ],
  imports: [
    CommonModule,
    WrapperRoutingModule,
    AuthModule,
    UserPageModule,
    FootbarModule,
    NavbarModule
  ], exports: [
    WrapperComponent
  ]
})
export class WrapperModule { }
