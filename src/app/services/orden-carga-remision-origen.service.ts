import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaRemisionOrigenService {

  private url = `${environment.api}/orden_carga_remision_origen`;

  constructor(private http: HttpClient) { }

  getListByOrdenCargaId(ordenCargaId: number): Observable<OrdenCargaRemisionOrigen[]> {
    return this.http.get<OrdenCargaRemisionOrigen[]>(`${this.url}/orden_carga/${ordenCargaId}`);
  }

  create(formData: FormData): Observable<OrdenCargaRemisionOrigen> {
    return this.http.post<OrdenCargaRemisionOrigen>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCargaRemisionOrigen> {
    return this.http.put<OrdenCargaRemisionOrigen>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCargaRemisionOrigen> {
    return this.http.delete<OrdenCargaRemisionOrigen>(`${this.url}/${id}`);
  }
}
