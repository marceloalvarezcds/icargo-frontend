import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PermisoAccionEnum, PermisoModeloEnum } from '../enums/permiso-enum';
import { mockUserAccount } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { PermisoPipe } from './permiso.pipe';

describe('PermisoPipe', () => {
  let userService: UserService;
  let pipe: PermisoPipe;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [ AuthService, UserService ],
    });
    userService = TestBed.inject(UserService);
    pipe = new PermisoPipe(userService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false', () => {
    expect(pipe.transform(undefined, PermisoAccionEnum.VER)).toBe(false);
  });

  it('should return true', () => {
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    expect(pipe.transform(PermisoModeloEnum.USER, PermisoAccionEnum.VER)).toBe(true);
  });

  it('should return false when gestorCuentaId = 1 ', () => {
    expect(pipe.transform(PermisoModeloEnum.USER, PermisoAccionEnum.VER, 1)).toBe(false);
  });

  it('should return true when gestorCuentaId = 1 ', () => {
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    expect(pipe.transform(PermisoModeloEnum.USER, PermisoAccionEnum.VER, 1)).toBe(true);
  });
});
