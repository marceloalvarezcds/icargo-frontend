import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaDescuentoService {

  private url = `${environment.api}/orden_carga_descuento`;

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<OrdenCargaDescuento> {
    return this.http.post<OrdenCargaDescuento>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCargaDescuento> {
    return this.http.put<OrdenCargaDescuento>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCargaDescuento> {
    return this.http.delete<OrdenCargaDescuento>(`${this.url}/${id}`);
  }
}
