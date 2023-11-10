import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CompositionMenuComponent } from './components/composition-menu/composition-menu.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModuleModule } from './shared-module/shared-module.module';
import { JwtInterceptor } from './utilis/JwtInterceptor';
import { ErrorInterceptor } from './utilis/ErrorInterceptor';
import { TokenStorage } from './utilis/token.storage';
import { AuthGuard } from './utilis/AuthGuard';
import { AuthService } from './utilis/auth.service';
import { PaymentComponent } from './components/payment/payment.component';
import { DrinkService } from './providers/drinkServices';
import { FoodService } from './providers/foodServices';
import { SwalService } from './providers/swalService';
import { UserService } from './providers/userService';
import { GlobalService } from './providers/globalService';
import { InvoiceService } from './providers/invoiceService';
import { FoodResolver } from './resolver/foodResolver';
import { MenuService } from './providers/menuService';
import { PaymentService } from './providers/paymentService';
import { MenuResolver } from './resolver/menuResolver';
import { DrinkResolver } from './resolver/drinkResolver';
import { MenuItemComponent } from './components/home/menu-item/menu-item.component';
import { EvaluateCarComponent } from './components/home/evaluate-car/evaluate-car.component';
import { CarColorService } from './providers/carColorService';
import { CarBodyService } from './providers/carBodyService';
import { EnginePowerService } from './providers/enginePowerService';
import { VehiculeModelService } from './providers/vehiculeModelService';
import { CarService } from './providers/carServices';
import { UploadService } from './providers/uploadService';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CompositionMenuComponent,
    LoginComponent,
    PaymentComponent,
    MenuItemComponent,
    EvaluateCarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModuleModule,
  ],
  exports: [],
  providers: [
    TokenStorage,
    AuthGuard,
    AuthService,
    DrinkService,
    FoodService,
    SwalService,
    UserService,
    GlobalService,
    InvoiceService,
    FoodResolver,
    MenuService,
    PaymentService,
    MenuResolver,
    DrinkResolver,
    CarColorService,
    CarBodyService,
    EnginePowerService,
    VehiculeModelService,
    UploadService,
    CarService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
