import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateFormService } from '../../data-access/guards/can-deactivate-form.service';
import { ContactUsComponent } from './contact-us.component';

const routes: Routes = [
    {
        path: '',
        component: ContactUsComponent,
        canDeactivate: [CanDeactivateFormService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactUsRoutingModule { }
