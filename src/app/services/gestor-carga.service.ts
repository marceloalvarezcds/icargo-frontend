import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GestorCarga, GestorCargaList } from '../interfaces/gestor-carga';

@Injectable({
  providedIn: 'root',
})
export class GestorCargaService {
  private url = `${environment.api}/gestor_carga`;

  constructor(private http: HttpClient) {}

  getList(): Observable<GestorCargaList[]> {
    return this.http.get<GestorCargaList[]>(`${this.url}/`);
  }

  getById(id: number): Observable<GestorCarga> {
    return this.http.get<GestorCarga>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<GestorCarga> {
    return this.http.post<GestorCarga>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<GestorCarga> {
    return this.http.put<GestorCarga>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<GestorCarga> {
    return this.http.delete<GestorCarga>(`${this.url}/${id}`);
  }
}
