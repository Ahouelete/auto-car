import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BackOfficeComponent } from './components/back-office/back-office.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-car', pathMatch: 'full' },
  { path: 'list-vehicule-model', component: BackOfficeComponent },
  { path: 'list-car-body', component: BackOfficeComponent },
  { path: 'list-car', component: BackOfficeComponent },
  { path: 'list-car-color', component: BackOfficeComponent },
  { path: 'list-engine-power', component: BackOfficeComponent },
  { path: 'list-user', component: BackOfficeComponent },
  { path: 'list-payment', component: BackOfficeComponent },
  { path: 'record-menu', component: BackOfficeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackOfficeModuleRoutingModule {}
