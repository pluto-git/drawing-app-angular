import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { httpLoader } from "./http-loades";

import {
  TRANSLOCO_CONFIG,
  TranslocoConfig,
  TranslocoModule
} from "@ngneat/transloco";
//Boostrap
import { CollapseModule } from 'ngx-bootstrap/collapse';

//CLI
import { AppComponent } from './components/app/app.component';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FootbarComponent } from './components/footbar/footbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutComponent } from './components/about/about.component';
import { CanvaComponent } from './components/canva/canva.component';
import { CanvaToolsHorizontalComponent } from './components/canva-tools-horizontal/canva-tools-horizontal.component';
//contains Header + router-outlet + Footer
import { HomeComponent } from './components/home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { PopupNoteComponent } from './components/popup-note/popup-note.component';

import {
  TRANSLOCO_PERSIST_LANG_STORAGE,
  TranslocoPersistLangModule,
} from '@ngneat/transloco-persist-lang';
import { SvgDrawingSheetComponent } from './not-needed/svg-drawing-sheet/svg-drawing-sheet.component';
import { MaterialModule } from './material.module';
import { NoteComponent } from './components/note/note.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FootbarComponent,
    NavbarComponent,
    PageNotFoundComponent,
    AboutComponent,
    CanvaComponent,
    HomeComponent,
    CanvaToolsHorizontalComponent,
    ContactUsComponent,
    SvgDrawingSheetComponent,
    PopupNoteComponent,
    NoteComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CollapseModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    TranslocoModule,
    TranslocoPersistLangModule.forRoot({
      storage: {
        provide: TRANSLOCO_PERSIST_LANG_STORAGE,
        useValue: localStorage,
      },
    })
  ],
  providers: [
    httpLoader,
    {
      provide: TRANSLOCO_CONFIG,
      useValue: {
        availableLangs: ["en", "uk"],
        reRenderOnLangChange: true,
        fallbackLang: "uk",
        defaultLang: "en"
      } as TranslocoConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
