import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Propietario, PropietarioList } from 'src/app/interfaces/propietario';

@Injectable({
  providedIn: 'root',
})
export class PropietarioService {
  private url = `${environment.api}/propietario`;

  constructor(private http: HttpClient) {}

  getList(): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(`${this.url}/`);
  }

  getListByGestorCuenta(): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(`${this.url}/gestor_cuenta`);
  }

  getListByGestorCuentaByCamionId(
    camionId: number
  ): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(
      `${this.url}/gestor_cuenta/${camionId}`
    );
  }

  getById(id: number): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Propietario> {
    return this.http.post<Propietario>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Propietario> {
    return this.http.put<Propietario>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Propietario> {
    return this.http.delete<Propietario>(`${this.url}/${id}`);
  }

  active(id: number): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.url}/${id}/inactive`);
  }
}
