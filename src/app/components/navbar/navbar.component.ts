import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  //our routes.
  dashboard = '/' + environment.routes.DASHBOARD;
  about = '/' + environment.routes.ABOUT;
  contact = '/' + environment.routes.CONTACT;

  activeLang = "";

  constructor(private translocoSvc: TranslocoService) {
  }

  ngOnInit(): void {
    this.activeLang = this.translocoSvc.getActiveLang();
  }

  change(lang: string): void {
    this.translocoSvc.setActiveLang(lang);
  }

}
