import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UploadService {
  url = environment.backend + '/upload';
  constructor(private http: HttpClient) {}

  uploadPicture(carId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/create?carId=${carId}`, formData);
  }

  downloadPicture(fileName: string): Observable<any> {
    return this.http.get(
      `${environment.backend}/auth/downloadFile/${fileName}`,
      {
        responseType: 'blob',
      }
    );
  }

  all(pageNo: number, pageSize: number): Observable<any> {
    return this.http.get(
      `${this.url}/all?pageNo=${pageNo}&pageSize=${pageSize}`
    );
  }
}
