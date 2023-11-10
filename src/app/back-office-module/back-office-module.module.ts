import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackOfficeModuleRoutingModule } from './back-office-module-routing.module';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { BackOfficeComponent } from './components/back-office/back-office.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListPaymentComponent } from './components/list-payment/list-payment.component';
import { ListVehiculeModelComponent } from './components/list-vehicule-model/list-vehicule-model.component';
import { ListCarBodyComponent } from './components/list-car-body/list-car-body.component';
import { ListCarColorComponent } from './components/list-car-color/list-car-color.component';
import { ListEnginePowerComponent } from './components/list-engine-power/list-engine-power.component';
import { ListCarComponent } from './components/list-car/list-car.component';

@NgModule({
  declarations: [
    ListUsersComponent,
    BackOfficeComponent,
    ListCarComponent,
    ListEnginePowerComponent,
    ListCarBodyComponent,
    ListCarColorComponent,
    ListPaymentComponent,
    ListVehiculeModelComponent,
  ],
  imports: [
    CommonModule,
    BackOfficeModuleRoutingModule,
    SharedModuleModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
})
export class BackOfficeModuleModule {}
