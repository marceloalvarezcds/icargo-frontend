import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Semi, SemiList } from 'src/app/interfaces/semi';

@Injectable({
  providedIn: 'root'
})
export class SemiService {

  private url = `${environment.api}/semi`;

  constructor(private http: HttpClient) { }

  getList(): Observable<SemiList[]> {
    return this.http.get<SemiList[]>(`${this.url}/`);
  }

  getListByCamionIdAndProductoId(camionId: number, producto_id: number): Observable<SemiList[]> {
    return this.http.get<SemiList[]>(`${this.url}/camion/${camionId}/producto/${producto_id}`);
  }

  getListByPropietarioId(propietarioId: number): Observable<SemiList[]> {
    return this.http.get<SemiList[]>(`${this.url}/propietario/${propietarioId}/`);
  }

  getById(id: number): Observable<Semi> {
    return this.http.get<Semi>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<Semi> {
    return this.http.post<Semi>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Semi> {
    return this.http.put<Semi>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Semi> {
    return this.http.delete<Semi>(`${this.url}/${id}`);
  }

  active(id: number): Observable<Semi> {
    return this.http.get<Semi>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Semi> {
    return this.http.get<Semi>(`${this.url}/${id}/inactive`);
  }
}
