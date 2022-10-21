import { Component, OnInit } from '@angular/core';
import { AppRoutes } from 'src/app/shared/data-access/routes';
import { AuthService } from 'src/app/shared/data-access/services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth.scss']
})
export class SignUpComponent implements OnInit {


  appRoutes = AppRoutes;
  
  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() { }

}
