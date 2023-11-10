import { Component, OnInit } from '@angular/core';
import { ApiResponse } from 'src/app/models/apiResponse';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalService, TYPE_ERROR } from 'src/app/providers/swalService';
import { GlobalService } from 'src/app/providers/globalService';
import { CarService } from 'src/app/providers/carServices';
import { ICar } from 'src/app/models/car';
import { User } from 'src/app/models/user';
import { TokenStorage } from 'src/app/utilis/token.storage';

export enum STATUT_CAR {
  TOUS = 'TOUS',
  SELLED = 'SELLED',
  NOT_SELLED = 'NOT_SELLED',
}

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.component.html',
  styleUrls: ['./my-cars.component.css'],
})
export class MyCarsComponent implements OnInit {
  statut_car = STATUT_CAR.TOUS;
  loading = true;
  totalRecords = 0;
  pageSize = 10;
  pageNo = 0;
  cars: ICar[] = [];
  sliceCars: ICar[] = [];
  userConnected!: User;

  constructor(
    private carService: CarService,
    private swalService: SwalService,
    private globalService: GlobalService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.userConnected = JSON.parse(this.tokenStorage.getCurrentUser());
    this.allCar(0, 10);
  }

  paginate(event: any) {
    this.loading = true;
    this.pageSize = event.rows;
    this.allCar(event.page, this.pageSize);
  }

  allCar(pageIndex: number, pageSize: number) {
    this.loading = true;
    const car$: Observable<any> = this.carService.all(pageIndex, pageSize);

    car$.subscribe({
      next: (data: ApiResponse) => {
        this.loading = false;
        if (data.success) {
          this.totalRecords = data.object?.totalElements;
          this.pageNo = data.object?.pageable?.pageNumber;
          this.pageSize = data.object?.pageable?.pageSize;
          this.sliceCars = data.object.content.filter(
            (car: ICar) => car.user && car.user.id == this.userConnected.id
          );
          this.filterCar('TOUS');
        }
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  filterCar(status: string) {
    this.statut_car = status as STATUT_CAR;

    if (status == STATUT_CAR.TOUS) {
      this.cars = [...this.sliceCars];
      return;
    }
    this.cars = this.sliceCars.filter((car) =>
      car.sell ? 'SELLED' : 'NOT_SELLED' == status
    );
  }

  onCancel(car: ICar) {
    this.swalService
      .messageYesNo(
        'Êtes-vous sûr?',
        'Êtes-vous sûr de vouloir supprimer cette voiture ?',
        'Non',
        'Oui! Annuler'
      )
      .then((willsuccess) => {
        if (willsuccess) {
          this.delete(car);
        }
      });
  }

  delete(car: ICar) {
    const car$: Observable<any> = this.carService.delete(car.id as string);

    car$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          this.retirerElement(car);
          this.swalService.message(data.message, TYPE_ERROR.SUCCESS);
        } else {
          this.swalService.message(data.message, TYPE_ERROR.ERROR);
        }
      },
      error: (error: HttpErrorResponse) => {
        const errorMsg = this.globalService.handleErrorHttp(error);
        this.swalService.message(errorMsg, TYPE_ERROR.ERROR);
      },
    });
  }

  onView(car: ICar) {}

  retirerElement(deletedCar: ICar, insertedCar?: ICar) {
    const position = this.cars.findIndex((car) => car.id == deletedCar.id);

    insertedCar
      ? this.cars.splice(position, position > -1 ? 1 : 0, insertedCar)
      : this.cars.splice(position, position > -1 ? 1 : 0);
  }
}
