import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAccount } from '../interfaces/user';
import { AuthService } from './auth.service';
import { USER_KEY } from '../contanst';
import { PermisoAccionEnum, PermisoModeloEnum } from '../enums/permiso-enum';
import { filter } from 'rxjs/operators';

const userItem = localStorage.getItem(USER_KEY) || 'null';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `${environment.api}/user`;
  private userSubject = new BehaviorSubject<UserAccount | null>(JSON.parse(userItem));

  constructor(private http: HttpClient, authService: AuthService) {
    authService.authObservable().subscribe(() => {
      this.me().subscribe((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      });
    });
  }

  private me(): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.url}/me/`);
  }

  getLoggedUser(): Observable<UserAccount> {
    return this.userSubject.pipe(filter(u => !!u)) as Observable<UserAccount>;
  }

  checkPermiso(accion: PermisoAccionEnum, modelo: PermisoModeloEnum): boolean {
    const user = this.userSubject.value;
    if (!user) { return false; }
    return user.permisos.findIndex(p => p.accion === accion && p.modelo === modelo && p.autorizado) !== -1
  }
}
