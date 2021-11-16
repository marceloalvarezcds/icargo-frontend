import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { UserService } from 'src/app/services/user.service';
import { mockUserAccount } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorService } from 'src/app/services/http-error.service';

import { PermisoGuard } from './permiso.guard';

describe('PermisoGuard', () => {
  let guard: PermisoGuard;
  let userService: UserService;
  const mockActivatedRouteSnapshot = {
    routeConfig: {
      path: a.VER,
    },
    parent: {
      routeConfig: {
        path: m.USER,
      },
    },
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [ AuthService, HttpErrorService, PermisoGuard, UserService ],
    });
  });

  it('canActivate = false', () => {
    guard = TestBed.inject(PermisoGuard);
    expect(guard.canActivate(mockActivatedRouteSnapshot as ActivatedRouteSnapshot)).toBe(false);
  });

  it('canActivate = true', () => {
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    guard = TestBed.inject(PermisoGuard);
    expect(guard.canActivate(mockActivatedRouteSnapshot as ActivatedRouteSnapshot)).toBe(true);
  });
});
