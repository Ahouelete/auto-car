import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import {TokenStorage} from './token.storage';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.tokenStorage.signOut();
      // location.reload(true);
      }
      return throwError(err);
    }));
  }
}
