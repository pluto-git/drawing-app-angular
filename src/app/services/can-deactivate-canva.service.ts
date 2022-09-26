import { Injectable } from '@angular/core';
import { OperationControlService } from './operation-control.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CanvaComponent } from '../components/canva/canva.component';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateCanvaService {
  component!: Object;
  route!: ActivatedRouteSnapshot;

  constructor(private op: OperationControlService) {
  }


  async canDeactivate(component: CanvaComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot): Promise<boolean> {

    return component.canExit();
  }


}
