import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Camion, CamionList } from 'src/app/interfaces/camion';

@Injectable({
  providedIn: 'root'
})
export class CamionService {

  private url = `${environment.api}/camion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<CamionList[]> {
    return this.http.get<CamionList[]>(`${this.url}/`);
  }

  getListByGestorCarga(): Observable<CamionList[]> {
    return this.http.get<CamionList[]>(`${this.url}/gestor_carga/`);
  }

  getListByProductoId(productoId: number): Observable<CamionList[]> {
    return this.http.get<CamionList[]>(`${this.url}/producto/${productoId}/`);
  }

  getListByPropietarioId(propietarioId: number): Observable<CamionList[]> {
    return this.http.get<CamionList[]>(`${this.url}/propietario/${propietarioId}/`);
  }

  getById(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<Camion> {
    return this.http.post<Camion>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Camion> {
    return this.http.put<Camion>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Camion> {
    return this.http.delete<Camion>(`${this.url}/${id}`);
  }

  active(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Camion> {
    return this.http.get<Camion>(`${this.url}/${id}/inactive`);
  }
}
