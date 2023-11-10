import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Login } from '../models/login';
import { User } from '../models/user';

@Injectable()
export class AuthService {
  authUrl = environment.backend + '/auth';
  url = environment.backend + '/user';
  constructor(private http: HttpClient) {}

  attemptAuth(login: Login): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, login);
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post(
      `${this.url}/reset-password?newPassword=${payload.password}&token=${payload.token}`,
      payload
    );
  }

  signup(account: User): Observable<any> {
    return this.http.post(`${this.url}/create`, account);
  }
}
