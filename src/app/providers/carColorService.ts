import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/apiResponse';
import { ICarColor } from '../models/carColor';

@Injectable()
export class CarColorService {
  url = environment.backend + '/car-color';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(car_color: any): Observable<Object> {
    return this.http.post(`${this.url}/create`, car_color);
  }

  update(car_color_id: number, car_color: ICarColor): Observable<Object> {
    return this.http.put(`${this.url}/update/${car_color_id}`, car_color);
  }

  delete(car_color_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${car_color_id}`);
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
