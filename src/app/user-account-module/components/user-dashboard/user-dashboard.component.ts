import { Component, OnInit } from '@angular/core';
import { CarService } from 'src/app/providers/carServices';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apiResponse';
import { TokenStorage } from 'src/app/utilis/token.storage';
import { User } from 'src/app/models/user';
import { ICar } from 'src/app/models/car';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
})
export class UserDashboardComponent implements OnInit {
  // VARIABLES

  carSelled = 0;
  carNotSelled = 0;
  currentUser!: User;
  cars: ICar[] = [];
  constructor(
    private carService: CarService,
    private tokenStorage: TokenStorage
  ) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.tokenStorage.getCurrentUser());

    this.getStatCar();
  }

  getStatCar() {
    const car$: Observable<any> = this.carService.all(0, 100);

    car$.subscribe({
      next: (data: ApiResponse) => {
        if (data.success) {
          const allCar: ICar[] = data.object.content;

          this.cars = allCar.filter(
            (car: ICar) => car.user && car.user.id == this.currentUser.id
          );

          this.carNotSelled = this.cars.filter((car: ICar) => !car.sell).length;
          this.carSelled = this.cars.filter((car: ICar) => car.sell).length;
        }
      },
    });
  }
}
