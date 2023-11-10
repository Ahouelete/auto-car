import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../models/apiResponse';
import { IVehiculeModel } from '../models/vehiculeModel';

@Injectable()
export class VehiculeModelService {
  url = environment.backend + '/vehicule-model';
  constructor(private http: HttpClient) {}

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }

  create(vehiculeModel: IVehiculeModel): Observable<Object> {
    return this.http.post(`${this.url}/create`, vehiculeModel);
  }

  update(
    vehiculeModel_id: number,
    vehiculeModel: IVehiculeModel
  ): Observable<Object> {
    return this.http.put(
      `${this.url}/update/${vehiculeModel_id}`,
      vehiculeModel
    );
  }

  delete(vehiculeModel_id: number): Observable<Object> {
    return this.http.delete(`${this.url}/delete/${vehiculeModel_id}`);
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
