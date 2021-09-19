import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { HttpErrorService } from '../services/http-error.service';

import { ErrorInterceptor } from './error.interceptor';

describe('ErrorInterceptor', () => {
  let authService: AuthService;
  let errorInterceptor: ErrorInterceptor;
  let httpErrorService: HttpErrorService;
  let httpHandlerSpy: any;
  let httpRequestSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        HttpErrorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    httpErrorService = TestBed.inject(HttpErrorService);
    httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    errorInterceptor = new ErrorInterceptor(authService, httpErrorService);
    spyOn(authService, 'logout');
    spyOn(httpErrorService, 'setErrorList');
  });

  it('test ErrorInterceptor with 401', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: 'Unauthorized' }, status: 401 }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(authService.logout).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor with status error = 0', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: 'Server not found' }, status: 0 }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor with 404', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: 'Not Found' }, status: 404 }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor error detail Array 1', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: [ { msg: 'Error' } ] } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor error detail Array 2', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: [ { err: 'Error' } ] } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor error detail String', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { detail: 'Error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error detail 1', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { error: 'Error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error detail 2', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { message: 'Error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error detail 3', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { statusText: 'Error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error detail 4', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { error: { err: 'Error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error 1', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { message: { detail: 'No error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error 2', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { statusText: { detail: 'No error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });

  it('test ErrorInterceptor without error 3', () => {
    httpHandlerSpy.handle.and.returnValue(throwError(
      { msg: { detail: 'No error' } }
    ));

    errorInterceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe({
      error: () => {
        expect(httpErrorService.setErrorList).toHaveBeenCalled();
      },
    });
  });
});
