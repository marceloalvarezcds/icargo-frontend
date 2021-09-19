import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from '../services/loading.service';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpController: HttpTestingController;
  let loadingService: LoadingService;
  let isLoading$: BehaviorSubject<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        LoadingService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
    isLoading$ = (loadingService as any).isLoading;
    spyOn(loadingService, 'startLoading');
    spyOn(loadingService, 'stopLoading');
  });

  it('test LoadingInterceptor', () => {
    expect(isLoading$.value).toBeFalse();

    const url = 'https://www.google.com/';
    httpClient.get(url, { responseType: 'text' }).subscribe();
    httpClient.get(url, { responseType: 'text' }).subscribe();

    const requests = httpController.match(url);

    requests[0].flush({}); //resuelve el request
    requests[1].flush({});

    httpController.verify();

    expect(loadingService.stopLoading).toHaveBeenCalledTimes(1);
    expect(loadingService.startLoading).toHaveBeenCalledTimes(1);
    expect(isLoading$.value).toBeFalse();
  });
});
