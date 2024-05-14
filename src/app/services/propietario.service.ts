import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Propietario, PropietarioList } from 'src/app/interfaces/propietario';
import { TipoPersona } from '../interfaces/tipo-persona';

@Injectable({
  providedIn: 'root',
})
export class PropietarioService {
  private url = `${environment.api}/propietario`;

  constructor(private http: HttpClient) {}
  getPropietarioByTipoPersonaId(tipoPersonaId: number): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.url}/tipoPersona/${tipoPersonaId}`);
  }
  getList(): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(`${this.url}/`);
  }
  getTipoPersonaList(): Observable<TipoPersona[]> {
    return this.http.get<TipoPersona[]>(`${this.url}/tipoPersona`);
  }
  getListByGestorCuenta(): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(`${this.url}/gestor_cuenta`);
  }
  getPropietario(): Observable<PropietarioList> {
    // Aquí haces la solicitud HTTP para obtener los datos del propietario
    return this.http.get<PropietarioList>(`${this.url}/propietario`);
  }
  getListByGestorCuentaByCamionId(
    camionId: number
  ): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(
      `${this.url}/gestor_cuenta/camion/${camionId}`
    );
  }

  getListByGestorCuentaBySemiId(semiId: number): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(
      `${this.url}/gestor_cuenta/semi/${semiId}`
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
