import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ContactUsComponent } from '../../feature/contact-us/contact-us.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateFormService {
  component!: Object;
  route!: ActivatedRouteSnapshot;

  constructor() {
  }

  canDeactivate(component: ContactUsComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (component.contactUsForm.dirty) {
      return component.canExit();
    }
    return true;

  }
}
