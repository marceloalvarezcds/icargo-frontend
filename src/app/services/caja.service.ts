import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caja } from 'src/app/interfaces/caja';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CajaService {
  private url = `${environment.api}/caja`;

  constructor(private http: HttpClient) {}

  getListByGestorCarga(): Observable<Caja[]> {
    return this.http.get<Caja[]>(`${this.url}/gestor_carga_id`);
  }

  getById(id: number): Observable<Caja> {
    return this.http.get<Caja>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Caja> {
    return this.http.post<Caja>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Caja> {
    return this.http.put<Caja>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Caja> {
    return this.http.delete<Caja>(`${this.url}/${id}`);
  }
}
