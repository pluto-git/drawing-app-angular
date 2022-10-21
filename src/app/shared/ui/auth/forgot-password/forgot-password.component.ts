import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';

import { AppRoutes } from 'src/app/shared/data-access/routes';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../auth.scss']
})
export class ForgotPasswordComponent implements OnInit {

  public appRoutes = AppRoutes;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

}
