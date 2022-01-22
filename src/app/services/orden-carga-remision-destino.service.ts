import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaRemisionDestinoService {

  private url = `${environment.api}/orden_carga_remision_destino`;

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<OrdenCargaRemisionDestino> {
    return this.http.post<OrdenCargaRemisionDestino>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCargaRemisionDestino> {
    return this.http.put<OrdenCargaRemisionDestino>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCargaRemisionDestino> {
    return this.http.delete<OrdenCargaRemisionDestino>(`${this.url}/${id}`);
  }
}
