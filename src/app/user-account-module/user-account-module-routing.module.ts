import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountComponent } from './components/user-account/user-account.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-dashboard', pathMatch: 'full' },
  { path: 'user-dashboard', component: UserAccountComponent },
  { path: 'my-cars', component: UserAccountComponent },
  { path: 'to-sell-car', component: UserAccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAccountModuleRoutingModule {}
