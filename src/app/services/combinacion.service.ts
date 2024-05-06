import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Combinacion } from '../interfaces/combinacion';

@Injectable({
  providedIn: 'root',
})
export class CombinacionService {
  private url = `${environment.api}/combinacion`;

  constructor(private http: HttpClient) {}

  getList(): Observable<Combinacion[]> {
    return this.http.get<Combinacion[]>(`${this.url}/`);
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

  getById(id: number): Observable<Combinacion> {
    return this.http.get<Combinacion>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(combinacion: Combinacion): Observable<Combinacion> {
    return this.http.post<Combinacion>(`${this.url}/`, combinacion);
  }

  edit(id: number, combinacion: Combinacion): Observable<Combinacion> {
    return this.http.put<Combinacion>(`${this.url}/${id}`, combinacion);
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
