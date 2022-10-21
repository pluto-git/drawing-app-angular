import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageNotFoundComponent } from './page-not-found.component';
import { FootbarModule } from '../../ui/footbar/footbar.module';
import { NavbarModule } from '../../ui/navbar/navbar.module';
import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
    declarations: [
        PageNotFoundComponent
    ],
    imports: [
        CommonModule,
        FootbarModule,
        NavbarModule,
        PageNotFoundRoutingModule,
        MatButtonModule
    ], exports: [
        PageNotFoundComponent
    ]
})
export class PageNotFoundModule { }
