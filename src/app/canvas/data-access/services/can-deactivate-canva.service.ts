import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanvaComponent } from 'src/app/canvas/feature/canvas/canva.component';
import { Observable } from '@firebase/util';

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
    nextState: RouterStateSnapshot): Promise<boolean | Observable<boolean> | boolean> {

    return component.canExit();
  }
}
