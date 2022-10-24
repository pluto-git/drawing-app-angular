import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService } from './shared/data-access/services/loader.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from './shared/data-access/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  //private sub!: Subscription;
  constructor(public loaderSvc: LoaderService,
    private authSvc: AuthService) {
  }

  ngOnInit(): void {

    //purely for easier tests:
    const isFirstTime = localStorage.getItem('isFirstTime') || 'true';
    if (isFirstTime === 'true') {
      //a dummy account, 
      //and our auth allows very dummy passwords if anything

      this.authSvc.SignIn('1@mail.com', '123456');
      localStorage.setItem('isFirstTime', 'false');
    }


  }


}
