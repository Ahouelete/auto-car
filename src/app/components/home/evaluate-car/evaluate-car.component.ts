import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponse } from 'src/app/models/apiResponse';
import { ICar } from 'src/app/models/car';
import { ICarBody } from 'src/app/models/carBody';
import { ICarColor } from 'src/app/models/carColor';
import { IEnginePower } from 'src/app/models/enginePower';
import { IVehiculeModel } from 'src/app/models/vehiculeModel';
import { CarBodyService } from 'src/app/providers/carBodyService';
import { CarColorService } from 'src/app/providers/carColorService';
import { CarService } from 'src/app/providers/carServices';
import { EnginePowerService } from 'src/app/providers/enginePowerService';
import { GlobalService } from 'src/app/providers/globalService';
import { UploadService } from 'src/app/providers/uploadService';
import { VehiculeModelService } from 'src/app/providers/vehiculeModelService';

@Component({
  selector: 'app-evaluate-car',
  templateUrl: './evaluate-car.component.html',
  styleUrls: ['./evaluate-car.component.css'],
})
export class EvaluateCarComponent implements OnInit {
  // DECLARATIONS DE VARIABLES

  evaluateResponseApi: ApiResponse | null | undefined;
  modelsVehicule: IVehiculeModel[] = [];
  enginePowers: IEnginePower[] = [];
  carsBody: ICarBody[] = [];
  carsColor: ICarColor[] = [];
  evaluateCarForm!: FormGroup;

  constructor(
    private enginePowerService: EnginePowerService,
    private carColorService: CarColorService,
    private carBodyService: CarBodyService,
    private vehiculeModelService: VehiculeModelService,
    private carService: CarService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.createEvaluateCarForm();
    this.allEnginerPower(0, 20);
    this.allVehiculeModel(0, 20);
    this.allCarBody(0, 20);
    this.allCarColor(0, 20);
  }

  createEvaluateCarForm() {
    this.evaluateCarForm = this.fb.group({
      carBody: [null, [Validators.required]],
      carColor: [null, [Validators.required]],
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

  downloadFile(fileName: string) {
    this.uploadService.downloadPicture(fileName).subscribe({
      next: (data: any) => {},
    });
  }
}
