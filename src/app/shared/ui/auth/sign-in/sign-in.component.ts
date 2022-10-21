import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
import { AppRoutes } from 'src/app/shared/data-access/routes';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../auth.scss']
})
export class SignInComponent implements OnInit {

  public appRoutes = AppRoutes;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {

  }


}
