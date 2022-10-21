import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LoaderService } from './shared/data-access/services/loader.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  //private sub!: Subscription;
  constructor(public loaderSvc: LoaderService, private spinner: NgxSpinnerService) {

  }

  ngOnInit(): void {
    // this.spinner.show();
    // setTimeout(() => this.spinner.hide(), 500);

  }


}
