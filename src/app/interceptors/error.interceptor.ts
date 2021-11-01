import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpErrorService } from '../services/http-error.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private httpErrorService: HttpErrorService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
        let errors = [];
        if (err.error) {
          if (err.status === 0) {
            errors = [
              'No tiene acceso al servidor, por favor verifique su conexión',
            ];
          } else if (err.status === 404) {
            errors = ['Error 404: No existe el recurso en el servidor'];
          } else if (err.error.detail instanceof Array) {
            errors = err.error.detail.map((e: any) =>
              e.msg ? e.msg : 'Ocurrió un error'
            );
          } else if (typeof err.error.detail === 'string') {
            errors = [err.error.detail];
          } else {
            errors = [
              err.error.error || err.error.message || err.statusText || err.error.toString(),
            ];
          }
        } else {
          errors = [err.message || err.statusText || err.toString()];
        }
        this.httpErrorService.setErrorList(errors);
        return throwError(errors);
      })
    );
  }
}
