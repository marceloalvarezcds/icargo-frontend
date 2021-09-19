import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

import { AuthGuard } from './auth.guard';

@Component({ template: '' })
class TestComponent { }

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let httpController: HttpTestingController;

  // async beforeEach
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: TestComponent }
        ]),
      ],
      providers: [ AuthGuard, AuthService ],
    });

    authService = TestBed.inject(AuthService);
    authGuard = TestBed.inject(AuthGuard);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('test AuthGuard with token = true', () => {
    const loginSpy = spyOn(authService , 'login').and.callThrough();

    const formData = new FormData();
    formData.append('username', 'user');
    formData.append('password', '1234');
    authService.login(formData).subscribe();
    expect(loginSpy).toHaveBeenCalledTimes(1);

    const url = `${environment.api}/login/`;
    const httpRequest = httpController.expectOne(url);
    httpRequest.flush({ access_token: 'token', token_type: 'bearer' });
  
    // spyOnProperty(authService, 'isAuthenticated').and.returnValue(true);
    expect(authGuard.canActivate()).toBe(true);
  });

  it('test AuthGuard with token = false', () => {
    spyOnProperty(authService, 'isAuthenticated').and.returnValue(false);
    expect(authGuard.canActivate()).toBe(false);
  });
});
