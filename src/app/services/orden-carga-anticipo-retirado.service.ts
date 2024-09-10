import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaAnticipoRetirado } from '../interfaces/orden-carga-anticipo-retirado';

@Injectable({
  providedIn: 'root',
})
export class OrdenCargaAnticipoRetiradoService {
  private url = `${environment.api}/orden_carga_anticipo_retirado`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<OrdenCargaAnticipoRetirado> {
    return this.http.post<OrdenCargaAnticipoRetirado>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCargaAnticipoRetirado> {
    return this.http.put<OrdenCargaAnticipoRetirado>(
      `${this.url}/${id}`,
      formData
    );
  }

  delete(id: number): Observable<OrdenCargaAnticipoRetirado> {
    return this.http.delete<OrdenCargaAnticipoRetirado>(`${this.url}/${id}`);
  }

  pdf(id: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf/retirados`);
  }
  
}
