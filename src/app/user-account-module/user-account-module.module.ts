import { NgModule } from '@angular/core';

import { UserAccountModuleRoutingModule } from './user-account-module-routing.module';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MyCarsComponent } from './components/my-cars/my-cars.component';
import { ToSellCarComponent } from './components/to-sell-car/to-sell-car.component';

@NgModule({
  declarations: [
    UserAccountComponent,
    UserDashboardComponent,
    MyCarsComponent,
    ToSellCarComponent,
  ],
  imports: [
    UserAccountModuleRoutingModule,
    SharedModuleModule,
    CommonModule,
    SharedModuleModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
})
export class UserAccountModuleModule {}
