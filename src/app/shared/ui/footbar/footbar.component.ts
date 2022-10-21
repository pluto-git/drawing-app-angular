import { Component } from '@angular/core';
import { AppRoutes } from '../../data-access/routes';

@Component({
  selector: 'app-footbar',
  templateUrl: './footbar.component.html',
  styleUrls: ['./footbar.component.scss'],
  providers: []
})
export class FootbarComponent {

  public currentYear = new Date().getFullYear();
  public dashboard = '/' + AppRoutes.dashboard;
  public about = '/' + AppRoutes.about;
  public contact = '/' + AppRoutes.contactUs;
  public gitLink = 'https://github.com/pluto-git';

  constructor() { }


}
