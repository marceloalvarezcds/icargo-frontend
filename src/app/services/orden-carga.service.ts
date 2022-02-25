import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';

@Injectable({
  providedIn: 'root',
})
export class OrdenCargaService {
  private url = `${environment.api}/orden_carga`;

  constructor(private http: HttpClient) {}

  getList(): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/`);
  }

  getById(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<OrdenCarga> {
    return this.http.post<OrdenCarga>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCarga> {
    return this.http.put<OrdenCarga>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCarga> {
    return this.http.delete<OrdenCarga>(`${this.url}/${id}`);
  }

  aceptar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/aceptar`);
  }

  cancelar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/cancelar`);
  }

  conciliar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/conciliar`);
  }

  finalizar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/finalizar`);
  }

  modificarAnticipos(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(
      `${this.url}/${id}/modify_advance_release`
    );
  }

  pdf(id: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf`);
  }

  resumenPdf(id: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf/resumen`);
  }
}
