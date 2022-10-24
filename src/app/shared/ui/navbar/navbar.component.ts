import { Component } from '@angular/core';
import { AuthService } from '../../data-access/services/auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../../data-access/routes';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  public isCollapsed = true;
  //our routes.
  public canvas = '/'+ AppRoutes.canvas;
  public dashboard = '/' + AppRoutes.dashboard;
  public about = '/' + AppRoutes.about;
  public contact = '/' + AppRoutes.contactUs;
  public welcome = '/' + AppRoutes.userPage;

  constructor(public authService: AuthService, private router: Router, public aFA: AngularFireAuth) { }

  login() {
    this.router.navigate([AppRoutes.login]);
  }

  logout() {
    this.authService.SignOut();
  }



}

