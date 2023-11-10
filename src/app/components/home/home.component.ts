import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, first, map, of, Observable, forkJoin } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ICar } from 'src/app/models/car';
import { CarService } from 'src/app/providers/carServices';
import { GlobalService } from 'src/app/providers/globalService';
import { UploadService } from 'src/app/providers/uploadService';
import { TokenStorage } from 'src/app/utilis/token.storage';

export enum Jour {
  AUJOURDHUI = 'AUJOURDHUI',
  DEMAIN = 'DEMAIN',
}

export enum Type {
  CAR = 'CAR',
}

export interface IUploadsCar {
  carId: string;
  id: number;
  fileName: string;
}

export interface PanierModel {
  product: any;
  type: Type;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent
  implements OnInit, AfterViewInit, OnDestroy, DoCheck
{
  //DECLARATION DE VARIABLES
  quantityPanier: number = 0;
  amountPanier: number = 0;
  newProductToPanier!: PanierModel | null;
  panierForm!: FormGroup;
  displayBasic = false;
  displayBasicViewCar = false;
  products: any[] = [];
  responsiveOptions: any[] = [];
  imagesCar: any[] = [];
  cars: ICar[] = [];
  uploads: IUploadsCar[] = [];
  private observer!: IntersectionObserver;

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorage,
    private route: Router,
    private globalService: GlobalService,
    private carService: CarService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.createPanierForm();

    this.getCarWithUrlPictures();

    this.getPanier();

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  getAllCarsToSell() {
    this.carService.all(0, 20).subscribe({
      next: (data: ApiResponse) => {
        this.cars = data.object.content;
      },
    });
  }

  getAllUploadsCar() {
    this.carService.all(0, 20).subscribe({
      next: (data: ApiResponse) => {
        this.uploads = data.object;
      },
    });
  }

  getCarWithPicture() {
    const car$: Observable<any> = this.carService.all(0, 20);
    const upload$: Observable<any> = this.carService.all(0, 20);
    car$.pipe(
      first(),
      concatMap((responseCar: ApiResponse) => {
        return upload$;
      })
    );
  }

  getCarWithUrlPictures() {
    const car$ = this.carService.all(0, 1000);
    const upload$ = this.uploadService.all(0, 1000);
    forkJoin([car$, upload$])
      .pipe(
        map(([cars, uploads]) =>
          cars.object.content
            .map((car: any) => {
              const uploadFound = uploads.object.content.filter(
                (upload: any) => upload.car.id == car.id
              );
              if (uploadFound.length > 0)
                return { ...car, images: uploadFound };
            })
            .filter((carsAndPicture: any) => carsAndPicture)
        )
      )
      .subscribe({
        next: (data) => {
          this.cars = data;
          console.log(this.cars);
        },
      });
  }

  scrollToService(): void {
    const $element = window.document.getElementById(
      'our-service'
    ) as HTMLElement;
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  scrollToAllCarToSell(): void {
    const $element = window.document.getElementById(
      'all-car-to-sell'
    ) as HTMLElement;
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  scrollToEvaluateCar(): void {
    const $element = window.document.getElementById(
      'evaluate-car'
    ) as HTMLElement;
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  createPanierForm() {
    this.panierForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0],
    });
  }

  changeQuantity(amount: number) {
    const quantity = this.panierForm.controls['quantity'].value;

    const total = quantity * amount;

    this.panierForm.controls['amount'].setValue(total);
  }

  formatNumber(money: number) {
    return this.globalService.formatNumber(money);
  }

  arrondi(value: number): string {
    return this.globalService.formatNumber(Math.round(value));
  }

  addNewProductToPanier(product: ICar, type: string) {
    this.newProductToPanier = { product: product, type: type as Type };

    this.panierForm.setValue({
      quantity: 1,
      amount: Math.round(product.systemAmount),
    });

    this.displayBasic = true;
  }

  addProductInPanier(formData: any, action: string) {
    const product = {
      product: { ...this.newProductToPanier },
      quantity: formData.quantity,
    };

    //get products in panier
    const panier = JSON.parse(this.tokenStorage.getPanier());
    let products: Array<any> = [];

    if (panier && panier.products) {
      products = [...panier.products];
    }

    const index = products.findIndex(
      (p) =>
        p.product.product.id == product.product.product.id &&
        p.product.type == product.product.type
    );

    if (index > -1) {
      products[index].quantity = products[index].quantity + product.quantity;
    } else {
      products.unshift({ ...product });
    }

    this.tokenStorage.savePanier(JSON.stringify({ products }));

    this.getPanier();

    this.panierForm.reset();
    this.displayBasic = false;
    this.newProductToPanier = null;

    if (action == 'PAYMENT') {
      this.route.navigateByUrl('payment');
    }
  }

  onViewCar(car: any) {
    this.imagesCar = car.images;
    this.displayBasicViewCar = true;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'warning';
    }
  }

  getPanier() {
    const panier = JSON.parse(this.tokenStorage.getPanier());

    let list: Array<any> = [];
    if (panier && panier.products) {
      list = panier.products;
    }

    let quantityTotal = 0;
    let amountTotal = 0;
    list.forEach((element) => {
      quantityTotal = quantityTotal + element.quantity;
      amountTotal =
        amountTotal +
        element.quantity * Math.round(element.product.product.systemAmount);
    });

    this.quantityPanier = quantityTotal;
    this.amountPanier = amountTotal;
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting == true) {
            entry.target.classList.add('appear-element');
          } else {
            entry.target.classList.remove('appear-element');
          }
        });
      },
      {
        rootMargin: '0px',
      }
    );

    const menu$ = document.querySelectorAll(
      '.home-page .container-decouvrer-nos-menus .menu'
    );

    menu$.forEach((menu) => {
      this.observer.observe(menu);
    });
  }

  ngDoCheck(): void {}

  ngOnDestroy() {
    this.observer.disconnect();
  }

  downloadPicture(fileName: string): any {
    this.uploadService.downloadPicture(fileName).subscribe({
      next: (response: any) => {
        const type =
          fileName.split('.')[1] == 'jpeg'
            ? 'image/jpeg'
            : fileName.split('.')[1] == 'jpeg'
            ? 'image/jpeg'
            : fileName.split('.')[1] == 'jpg'
            ? 'image/jpg'
            : fileName.split('.')[1] == 'png'
            ? 'image/png'
            : '';
        var binaryData = [];
        binaryData.push(response);
        return URL.createObjectURL(new Blob(binaryData, { type: type }));
      },
    });
  }
}
