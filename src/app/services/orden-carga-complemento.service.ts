import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaComplementoService {

  private url = `${environment.api}/orden_carga_complemento`;

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<OrdenCargaComplemento> {
    return this.http.post<OrdenCargaComplemento>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCargaComplemento> {
    return this.http.put<OrdenCargaComplemento>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCargaComplemento> {
    return this.http.delete<OrdenCargaComplemento>(`${this.url}/${id}`);
  }
}
