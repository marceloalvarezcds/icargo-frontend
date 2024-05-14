import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Combinacion, CombinacionList } from '../interfaces/combinacion';

@Injectable({
  providedIn: 'root',
})
export class CombinacionService {
  private url = `${environment.api}/combinacion`;

  constructor(private http: HttpClient) {}

  getList(): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/`);
  }

  getListByGestorCarga(): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(`${this.url}/gestor_carga`);
  }

  getListByProductoId(productoId: number): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(`${this.url}/producto/${productoId}`);
  }

  getListByPropietarioId(propietarioId: number): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(
      `${this.url}/propietario/${propietarioId}`
    );
  }
  getListByGestorCuentaByCamionId(
    camionId: number
  ): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(
      `${this.url}/gestor_cuenta/camion/${camionId}`
    );
  }
  getListByGestorCuenta(): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(`${this.url}/gestor_cuenta`);
  }

  getListByGestorCuentaBySemiId(semiId: number): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(
      `${this.url}/gestor_cuenta/semi/${semiId}`
    );
  }
  getById(id: number): Observable<CombinacionList> {
    return this.http.get<CombinacionList>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Combinacion> {
    return this.http.post<Combinacion>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Combinacion> {
    return this.http.put<Combinacion>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Combinacion> {
    return this.http.delete<Combinacion>(`${this.url}/${id}`);
  }

  active(id: number): Observable<Combinacion> {
    return this.http.get<Combinacion>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Combinacion> {
    return this.http.get<Combinacion>(`${this.url}/${id}/inactive`);
  }
}
