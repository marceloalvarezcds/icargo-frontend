import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, UserAccount } from '../interfaces/user';
import { AuthService } from './auth.service';
import { USER_KEY } from '../contanst';
import { PermisoAccionEnum, PermisoModeloEnum } from '../enums/permiso-enum';
import { checkPermiso, checkPermisoAndGestorCargaId } from '../utils/permiso';
import { filter } from 'rxjs/operators';

const userItem = localStorage.getItem(USER_KEY) || 'null';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = `${environment.api}/user`;
  private userSubject = new BehaviorSubject<UserAccount | null>(
    JSON.parse(userItem)
  );

  constructor(private http: HttpClient, authService: AuthService) {
    authService.authObservable().subscribe(() => {
      this.me().subscribe((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.userSubject.next(user);
      });
    });
  }

  private me(): Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.url}/me`);
  }

  getLoggedUser(): Observable<UserAccount> {
    return this.userSubject.pipe(filter((u) => !!u)) as Observable<UserAccount>;
  }

  getListByGestorCargaId(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/gestor_carga_id`);
  }

  checkPermiso(accion: PermisoAccionEnum, modelo: PermisoModeloEnum): boolean {
    return checkPermiso(this.userSubject.value, accion, modelo);
  }

  checkPermisoAndGestorCargaId(
    accion: PermisoAccionEnum,
    modelo: PermisoModeloEnum,
    gestorCuentaId: number | undefined
  ): boolean {
    return checkPermisoAndGestorCargaId(
      this.userSubject.value,
      accion,
      modelo,
      gestorCuentaId
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}/inactive`);
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`${this.url}/${id}`);
  }
}
