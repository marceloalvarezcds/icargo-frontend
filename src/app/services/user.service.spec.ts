import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from 'src/environments/environment';
import { mockAuthentication } from '../interfaces/authentication';
import { mockUser } from '../interfaces/user';
import { AuthService } from './auth.service';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpController: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, UserService],
    });
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', fakeAsync(() => {
    authService = TestBed.inject(AuthService);
    service = TestBed.inject(UserService);
    const meSpy = spyOn((service as any), 'me').and.callThrough();
    (authService as any).authenticationSubject.next(mockAuthentication);
    flushMicrotasks();
    httpController.expectOne(`${environment.api}/user/me/`).flush(mockUser);
    flush();
    expect(service).toBeTruthy();
    expect(meSpy).toHaveBeenCalled();
    httpController.verify();
  }));
});
