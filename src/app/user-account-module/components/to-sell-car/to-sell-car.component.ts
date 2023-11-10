import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, concat, concatMap, first, take } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ICar } from 'src/app/models/car';
import { ICarBody } from 'src/app/models/carBody';
import { ICarColor } from 'src/app/models/carColor';
import { IEnginePower } from 'src/app/models/enginePower';
import { User } from 'src/app/models/user';
import { IVehiculeModel } from 'src/app/models/vehiculeModel';
import { CarBodyService } from 'src/app/providers/carBodyService';
import { CarColorService } from 'src/app/providers/carColorService';
import { CarService } from 'src/app/providers/carServices';
import { EnginePowerService } from 'src/app/providers/enginePowerService';
import { GlobalService } from 'src/app/providers/globalService';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { UploadService } from 'src/app/providers/uploadService';
import { VehiculeModelService } from 'src/app/providers/vehiculeModelService';
import { TokenStorage } from 'src/app/utilis/token.storage';

@Component({
  selector: 'app-to-sell-car',
  templateUrl: './to-sell-car.component.html',
  styleUrls: ['./to-sell-car.component.css'],
})
export class ToSellCarComponent implements OnInit {
  evaluateResponseApi: ApiResponse | null | undefined;
  createCarResponseApi: ApiResponse | null | undefined;
  modelsVehicule: IVehiculeModel[] = [];
  enginePowers: IEnginePower[] = [];
  carsBody: ICarBody[] = [];
  carsColor: ICarColor[] = [];
  evaluateCarForm!: FormGroup;
  carInputsAdditionnalForm!: FormGroup;
  firstPicture: File | null | undefined;
  secondPicture: File | null | undefined;
  thirdPicture: File | null | undefined;
  currentUser!: User;

  constructor(
    private enginePowerService: EnginePowerService,
    private carColorService: CarColorService,
    private carBodyService: CarBodyService,
    private vehiculeModelService: VehiculeModelService,
    private carService: CarService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private swalService: SwalService,
    private uploadService: UploadService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.tokenStorage.getCurrentUser());

    this.createEvaluateCarForm();
    this.createCarInputsAdditionnalForm();
    this.allEnginerPower(0, 20);
    this.allVehiculeModel(0, 20);
    this.allCarBody(0, 20);
    this.allCarColor(0, 20);
  }

  createEvaluateCarForm() {
    this.evaluateCarForm = this.fb.group({
      carBody: [null, [Validators.required]],
      color: [null, [Validators.required]],
      desiredAmount: [0],
      enginePower: [null, [Validators.required]],
      id: [null],
      isfuel: [false],
      numberOfDoor: [0, [Validators.required]],
      numberOfKey: [0, [Validators.required]],
      numberOfKilometerUsed: [0, [Validators.required]],
      payment: null,
      productionYear: [null, [Validators.required]],
      realSellAmount: [0],
      sell: [false],
      systemAmount: [0],
      technicalVisitCheck: [false],
      vehiculeInsurance: [false],
      vehiculeModel: [null, [Validators.required]],
      user: null,
    });
  }

  createCarInputsAdditionnalForm() {
    this.carInputsAdditionnalForm = this.fb.group({
      desiredAmount: [0, [Validators.required]],
    });
  }

  fileChoose(event: any, who: string) {
    switch (who) {
      case 'first':
        if (!event) this.firstPicture = null;

        if (event && event.target && event.target.files)
          this.firstPicture = event.target.files[0];

        break;

      case 'second':
        if (!event) this.secondPicture = null;

        if (event && event.target && event.target.files)
          this.secondPicture = event.target.files[0];

        break;

      case 'third':
        if (!event) this.thirdPicture = null;

        if (event && event.target && event.target.files)
          this.thirdPicture = event.target.files[0];

        break;

      default:
        break;
    }
    // formData.append('file', event.target.files[0]);
  }

  allEnginerPower(pageNo: number, pageSize: number) {
    this.enginePowerService.all(pageNo, pageSize).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.enginePowers = data.object?.content;
        }
      },
    });
  }

  allCarColor(pageNo: number, pageSize: number) {
    this.carColorService.all(pageNo, pageSize).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.carsColor = data.object?.content;
        }
      },
    });
  }

  allCarBody(pageNo: number, pageSize: number) {
    this.carBodyService.all(pageNo, pageSize).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.carsBody = data.object?.content;
        }
      },
    });
  }

  allVehiculeModel(pageNo: number, pageSize: number) {
    this.vehiculeModelService.all(pageNo, pageSize).subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.modelsVehicule = data.object?.content;
        }
      },
    });
  }

  compareFn(o1: any, o2: any) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  evaluateCar(car: ICar) {
    if (this.evaluateResponseApi?.isLoading) return;

    this.evaluateResponseApi = {
      object: null,
      isLoading: true,
      message: '',
      success: false,
    };

    this.carService.evaluate(car).subscribe({
      next: (data: ApiResponse) => {
        this.evaluateResponseApi = { ...data, isLoading: false };
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.evaluateResponseApi = {
          message: errorMsg,
          object: null,
          success: false,
          isLoading: false,
        };
      },
    });
  }

  createCar() {
    if (
      this.evaluateCarForm.invalid ||
      this.carInputsAdditionnalForm.invalid ||
      !this.firstPicture ||
      !this.secondPicture ||
      !this.thirdPicture
    ) {
      this.swalService.message(
        'Vérifier si les champs obligatoires et toutes les photos ont été renseignés',
        TYPE_ERROR.ERROR
      );
    }

    const car = {
      ...this.evaluateCarForm.value,
      ...this.carInputsAdditionnalForm.value,
      systemAmount: Math.round(this.evaluateResponseApi!.object),
      user: this.currentUser,
    };

    if (this.createCarResponseApi?.isLoading) return;

    this.createCarResponseApi = {
      object: null,
      isLoading: true,
      message: '',
      success: false,
    };

    let carResponseApi$: Observable<any>;
    const formData: FormData = new FormData();
    formData.append('files', this.firstPicture as File);
    formData.append('files', this.secondPicture as File);
    formData.append('files', this.thirdPicture as File);

    const car$: Observable<any> = this.carService.create(car).pipe(
      first(),
      concatMap((response) => {
        carResponseApi$ = response;
        return this.uploadService.uploadPicture(response.object.id, formData);
      })
    );

    car$.subscribe({
      next: (data: ApiResponse) => {
        this.createCarResponseApi = { ...data, isLoading: false };
        if (data.success) {
          this.resetEvaluateCarForm();
          this.carInputsAdditionnalForm.reset();
          this.createCarResponseApi = {
            message: '',
            object: null,
            success: false,
            isLoading: false,
          };
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
          return;
        }

        this.swalService.message(data.message, TYPE_ERROR.ERROR);
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.createCarResponseApi = {
          message: errorMsg,
          object: null,
          success: false,
          isLoading: false,
        };
      },
    });
  }

  resetEvaluateCarForm() {
    this.evaluateResponseApi = {
      message: '',
      object: null,
      success: false,
      isLoading: false,
    };
    this.evaluateCarForm.reset();
  }

  arrondi(value: number): string {
    return this.globalService.formatNumber(Math.round(value));
  }
}
