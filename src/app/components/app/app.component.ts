import { Component, OnInit } from '@angular/core';
export let browserRefresh = false;

declare global {
  interface Window {
    mobileAndTabletCheck: any;
    opera: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ngOnInit(): void {

  }

}