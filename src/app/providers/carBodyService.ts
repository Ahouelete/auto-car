import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/apiResponse';
import { ICarBody } from '../models/carBody';

@Injectable()
export class CarBodyService {
  url = environment.backend + '/car-body';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(car_body: ICarBody): Observable<Object> {
    return this.http.post(`${this.url}/create`, car_body);
  }

  update(car_body_id: number, car_body: ICarBody): Observable<Object> {
    return this.http.put(`${this.url}/update/${car_body_id}`, car_body);
  }

  delete(car_body_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${car_body_id}`);
  }

  mocks(): Observable<ApiResponse> {
    // const respones: ICar[] = [
    //   {
    //     id: 1,
    //     name: 'GUINESS',
    //     amount: 2500,
    //   },
    //   {
    //     id: 2,
    //     name: 'MOKA',
    //     amount: 2500,
    //   },
    //   {
    //     id: 3,
    //     name: 'YOUKI',
    //     amount: 2500,
    //   },
    //   {
    //     id: 4,
    //     name: 'BEAUFORT',
    //     amount: 2500,
    //   },
    //   {
    //     id: 5,
    //     name: 'BIERE',
    //     amount: 2500,
    //   },
    // ];

    return of({
      success: true,
      object: null,
      message: 'Liste des boisson',
    });
  }
}
