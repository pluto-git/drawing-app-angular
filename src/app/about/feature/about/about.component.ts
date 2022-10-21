import { Component } from '@angular/core';
import { AppRoutes } from 'src/app/shared/data-access/routes';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  public dashboard = '/' + AppRoutes.dashboard;

  constructor() { }

}
