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

  getAllList(): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/all`);
  }

  getList(): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/`);
  }

  getListByOc(): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/combinacion/orden-carga`);
  }

  getListByOcChapa(chapa:string): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/combinacion/orden-carga/${chapa}`);
  }

  getListActiva(): Observable<CombinacionList[]> {
    return this.http.get<CombinacionList[]>(`${this.url}/combinacion/activa`);
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

  getListByCamionId(camionId: number): Observable<Combinacion[]> {
    return this.http.get<CombinacionList[]>(
      `${this.url}/camion/${camionId}`
    );
  }

  getCombinacionesActivas(camionId: number): Observable<Combinacion[]> {
    return this.http.get<CombinacionList[]>(
      `${this.url}/combinacion_por_camion/${camionId}`
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

  getListByCamionIdAndSemiId(
    camionId: number,
    semiId: number
  ): Observable<Combinacion | null> {
    return this.http.get<Combinacion | null>(
      `${this.url}/camion/${camionId}/semi/${semiId}`
    );
  }

  getById(id: number): Observable<CombinacionList> {
    return this.http.get<CombinacionList>(`${this.url}/${id}`);
  }

  getCombinacionById(id: number): Observable<CombinacionList> {
    return this.http.get<CombinacionList>(`${this.url}/${id}/combinacion`);
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

