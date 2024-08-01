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
  
  getListByTipoPersonaId(tipoPersonaId: number): Observable<Propietario[]> {
    return this.http.get<Propietario[]>(`${this.url}/propietario?tipoPersonaId=${tipoPersonaId}`);
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
  getListByPersonaId(tipoPersonaId: number): Observable<PropietarioList[]> {
    return this.http.get<PropietarioList[]>(`${this.url}/tipo_persona/${tipoPersonaId}`);
  }
  inactive(id: number): Observable<Propietario> {
    return this.http.get<Propietario>(`${this.url}/${id}/inactive`);
  }
  getListByTipoPersona(tipoPersona: string): Observable<TipoPersona> {
    return this.http.get<TipoPersona>(
      `${this.url}/tipo_persona/${tipoPersona}`
    );
  }
  
  getPropietariosByTipoPersona(tipoPersona: string): Observable<Propietario[]> {
    return this.http.get<Propietario[]>(`api/propietario?tipoPersona=${tipoPersona}`); // Ajusta la URL a tu API
  }
}
