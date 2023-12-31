import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/providers/globalService';
import { TokenStorage } from 'src/app/utilis/token.storage';
import { Type } from '../home/home.component';
import { CURRENCY, Transaction } from 'src/app/models/transaction';
import { Payment } from 'src/app/models/payment';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { Router } from '@angular/router';
import { UserService } from 'src/app/providers/userService';
import { User } from 'src/app/models/user';
import { ICar } from 'src/app/models/car';
import { PaymentService } from 'src/app/providers/paymentService';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
  //DECLARATION VARIABLES
  products: any[] = [];
  amountInvoice = 0;
  quantityOrdered = 0;
  modePaymentChoice = '';
  listModePayment: any[] = [
    'CREDIT_CARD',
    'DIRECT_CASH',
    'DEBIT_CARD',
    'E_WALLET',
    'MOBILE_MONEY',
  ];
  modePaymentForm!: FormGroup;
  error!: ApiResponse;
  currentCustomer!: User;

  constructor(
    private tokenStorage: TokenStorage,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private paymentService: PaymentService,
    private swalService: SwalService,
    private route: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.createModePaymentForm();
    this.changePaymentMethod();
    this.getPanier();
    this.getCurrentCustomer();
  }

  createModePaymentForm() {
    this.modePaymentForm = this.fb.group({
      paymentMethod: [this.listModePayment[0], [Validators.required]],
      tel: [null, [Validators.required]],
      cardNumber: [null, [Validators.required]],
    });
  }

  getCurrentCustomer() {
    const currentUser = JSON.parse(this.tokenStorage.getCurrentUser());
    this.currentCustomer = currentUser;
  }

  formatNumber(money: number) {
    return this.globalService.formatNumber(money);
  }

  getPanier() {
    const panier = JSON.parse(this.tokenStorage.getPanier());

    if (panier && panier.products) {
      this.products = panier.products;
    }

    let quantityTotal = 0;
    let amountTotal = 0;
    this.products.forEach((element) => {
      quantityTotal = quantityTotal + element.quantity;
      amountTotal =
        amountTotal +
        element.quantity * Math.round(element.product.product.systemAmount);
    });
    this.quantityOrdered = quantityTotal;
    this.amountInvoice = amountTotal;
  }

  compareFn(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  createOrder(formData: any) {
    if (!this.currentCustomer) {
      this.swalService.message(
        "Vous n'avez pas de compte actuellement! Veuillez vous inscrire svp",
        TYPE_ERROR.ERROR
      );
      this.route.navigateByUrl('/signup');
      return;
    }

    this.globalService.toogleLoading();

    const carList: ICar[] = this.products
      .filter((product) => product.product.type == Type.CAR)
      .map((p) => p.product.product);

    const payment: Payment = {
      id: null,
      car: carList[0],
      amount: this.amountInvoice,
    };

    const paymentResponse$: Observable<any> =
      this.paymentService.create(payment);

    paymentResponse$.subscribe({
      next: (data: ApiResponse) => {
        this.globalService.toogleLoading();

        if (data.success) {
          this.tokenStorage.ResetPanier();

          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.globalService.toogleLoading();

        const errorMsg = this.globalService.handleErrorHttp(error);
        this.error = {
          message: errorMsg,
          success: false,
          object: null,
        };
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  changePaymentMethod() {
    const paymentMethodValue =
      this.modePaymentForm.controls['paymentMethod'].value;

    this.modePaymentChoice = paymentMethodValue;
    if (paymentMethodValue == 'MOBILE_MONEY') {
      this.modePaymentForm.controls['cardNumber'].clearValidators();
      this.modePaymentForm.controls['cardNumber'].updateValueAndValidity({
        emitEvent: true,
      });

      this.modePaymentForm.controls['tel'].clearValidators();
      this.modePaymentForm.controls['tel'].setValidators(
        Validators.compose([Validators.required])
      );

      this.modePaymentForm.controls['tel'].updateValueAndValidity({
        emitEvent: true,
      });
    } else {
      this.modePaymentForm.controls['tel'].clearValidators();
      this.modePaymentForm.controls['tel'].updateValueAndValidity({
        emitEvent: true,
      });

      this.modePaymentForm.controls['cardNumber'].clearValidators();
      this.modePaymentForm.controls['cardNumber'].setValidators(
        Validators.compose([Validators.required])
      );

      this.modePaymentForm.controls['cardNumber'].updateValueAndValidity({
        emitEvent: true,
      });
    }
  }

  arrondi(value: number): string {
    return this.globalService.formatNumber(Math.round(value));
  }

  deleteProduct(deletedProduct: any) {
    const position = this.products.findIndex(
      (product) =>
        deletedProduct.product.product.id == product.product.product.id &&
        deletedProduct.product.type == product.product.type
    );

    this.products.splice(position, position > -1 ? 1 : 0);

    this.tokenStorage.savePanier(JSON.stringify({ products: this.products }));

    this.getPanier();

    if (this.quantityOrdered < 1) {
      this.route.navigateByUrl('/home');
    }
  }
}
