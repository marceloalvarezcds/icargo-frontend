import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { mockUserAccount } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { PermisoPipe } from './permiso.pipe';
import { UserGestorCuentaPipe } from './user-gestor-cuenta.pipe';

describe('UserGestorCuentaPipe', () => {
  let userService: UserService;
  let permisoPipe: PermisoPipe;
  let pipe: UserGestorCuentaPipe;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [ AuthService, UserService ],
    });
    userService = TestBed.inject(UserService);
    permisoPipe = new PermisoPipe(userService);
    pipe = new UserGestorCuentaPipe(userService, permisoPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return false', () => {
    pipe.transform(undefined, PermisoAccionEnum.VER).subscribe(result => {
      expect(result).toBe(false);
    });
  });

  it('should return true', () => {
    userService = TestBed.inject(UserService);
    (userService as any).userSubject.next(mockUserAccount);
    pipe.transform(PermisoModeloEnum.USER, PermisoAccionEnum.VER).subscribe(result => {
      expect(result).toBe(true);
    });
  });
});
