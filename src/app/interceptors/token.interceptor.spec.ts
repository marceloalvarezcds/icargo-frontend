import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { BackendTestService } from '../services/backend-test.service';

import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let authService: AuthService;
  let httpClient: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        AuthService,
        BackendTestService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    authService = TestBed.inject(AuthService);
    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterAll(() => {
    httpController.verify();
  });

  it('test TokenInterceptor with token', () => {
    spyOnProperty(authService, 'token').and.returnValue({
      access_token: 'token',
      token_type: 'bearer',
    });

    const url = `${environment.api}/alive/`;
    httpClient.get(url).subscribe();
    const httpRequest = httpController.expectOne(url);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
  });

  it('test TokenInterceptor without token', () => {
    const backendTestService = TestBed.inject(BackendTestService);
    backendTestService.alive().subscribe();

    const url = `${environment.api}/alive/`;
    const httpRequest = httpController.expectOne(url);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(false);

    httpRequest.flush({}); // Execute subscribe of alive Observable
  });
});
