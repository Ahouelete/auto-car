import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/apiResponse';
import { ICar } from '../models/car';

@Injectable()
export class CarService {
  url = environment.backend + '/car';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  getUploadsCar(carId: string): Observable<any> {
    return this.http.get(`${this.url}/uploads/${carId}`);
  }

  create(car: ICar): Observable<any> {
    return this.http.post(`${this.url}/create`, car);
  }

  evaluate(car: ICar): Observable<any> {
    return this.http.post(`${this.url}/evaluate`, car);
  }

  update(car_id: string, car: ICar): Observable<Object> {
    return this.http.put(`${this.url}/update/${car_id}`, car);
  }

  delete(car_id: string): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${car_id}`);
  }

  mocks(): Observable<ApiResponse> {
    const respones: ICar[] = [
      {
        id: 'cd86f861-a9ae-4031-8344-05c461dd0826',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 37000.0,
        desiredAmount: 25000.0,
        realSellAmount: 45000.0,
        payment: null,
        user: null,
        sell: true,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },

      {
        id: '6036df9f-595e-4ea4-a511-ef6d9e335ff0',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 599290.6802548931,
        desiredAmount: 25000.0,
        realSellAmount: 45000.0,
        payment: null,
        user: null,
        sell: false,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
      {
        id: 'e9d92ed7-3189-43f0-bbd6-42fab0c6c545',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 864411.331350813,
        desiredAmount: 25000.0,
        realSellAmount: 45000.0,
        payment: null,
        user: null,
        sell: true,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
      {
        id: '1e7d3a41-8e2f-4f60-b43b-2be68e96cad8',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 791681.8001104626,
        desiredAmount: 25000.0,
        realSellAmount: 0.0,
        payment: null,
        user: null,
        sell: true,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
      {
        id: '8ecbba9a-bb24-43de-905d-1bcace4e0e14',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 517913.49188601907,
        desiredAmount: 25000.0,
        realSellAmount: 0.0,
        payment: null,
        user: null,
        sell: false,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
      {
        id: 'c6c6afab-6fc0-4cd5-ab74-00e9d32b8582',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2012,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 695483.4850760305,
        desiredAmount: 0.0,
        realSellAmount: 0.0,
        payment: null,
        user: null,
        sell: false,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
      {
        id: '4c32cb02-b895-45a7-88de-7d718604df97',
        vehiculeModel: {
          id: 7271,
          year: 2012,
          make: 'Toyota',
          model: 'Yaris',
        },
        color: {
          id: 4,
          color: 'blue',
        },
        productionYear: 2010,
        isfuel: true,
        carBody: {
          id: 3,
          body: 'monospace',
        },
        numberOfDoor: 4,
        enginePower: {
          id: 2,
          power: '259',
        },
        numberOfKilometerUsed: 123456,
        numberOfKey: 2,
        vehiculeInsurance: true,
        technicalVisitCheck: true,
        systemAmount: 509480.7845557057,
        desiredAmount: 0.0,
        realSellAmount: 0.0,
        payment: null,
        user: null,
        sell: false,
        images: [
          {
            url: 'assets/pictures/car1.jpg',
          },
          {
            url: 'assets/pictures/car2.jpeg',
          },
          {
            url: 'assets/pictures/car3.jpeg',
          },
          {
            url: 'assets/pictures/car4.jpeg',
          },
        ],
      },
    ];

    return of({
      success: true,
      object: respones,
      message: 'Liste des cars',
    });
  }
}
