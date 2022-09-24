import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footbar',
  templateUrl: './footbar.component.html',
  styleUrls: ['./footbar.component.css']
})
export class FootbarComponent implements OnInit {

  currentYear = new Date().getFullYear();
  dashboard = '/' + environment.routes.DASHBOARD;
  about = '/' + environment.routes.ABOUT;
  contact = '/' + environment.routes.CONTACT;

  constructor() { }

  ngOnInit(): void {
  }

}
