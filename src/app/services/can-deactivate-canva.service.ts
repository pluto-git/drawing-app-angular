import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanvaComponent } from '../components/canva/canva.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateCanvaService {
  component!: Object;
  route!: ActivatedRouteSnapshot;

  constructor() {
  }


  async canDeactivate(component: CanvaComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Promise<boolean> {

    return component.canExit();
  }


}
