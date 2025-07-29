import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol, RolChecked } from 'src/app/interfaces/rol';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private url = `${environment.api}/rol`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}`);
  }

  getList(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/`);
  }

  getActiveList(): Observable<RolChecked[]> {
    return this.http.get<RolChecked[]>(`${this.url}/active_list`);
  }

  create(formData: FormData): Observable<Rol> {
    return this.http.post<Rol>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Rol> {
    return this.http.put<Rol>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/${id}/inactive`);
  }

  getLoggedRol(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/me/roles`);
  }

}
