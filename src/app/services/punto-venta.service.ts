import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PuntoVenta, PuntoVentaList } from '../interfaces/punto-venta';

@Injectable({
  providedIn: 'root',
})
export class PuntoVentaService {
  private url = `${environment.api}/punto_venta`;

  constructor(private http: HttpClient) {}

  getList(proveedorId: number): Observable<PuntoVentaList[]> {
    return this.http.get<PuntoVentaList[]>(
      `${this.url}/proveedor/${proveedorId}`
    );
  }

  getListByGestor(): Observable<PuntoVentaList[]> {
    return this.http.get<PuntoVentaList[]>(`${this.url}/`);
  }

  getListByInsumoIdAndProveedorId(
    insumoId: number,
    proveedorId: number
  ): Observable<PuntoVentaList[]> {
    return this.http.get<PuntoVentaList[]>(
      `${this.url}/insumo/${insumoId}/proveedor/${proveedorId}`
    );
  }

  getById(id: number): Observable<PuntoVenta> {
    return this.http.get<PuntoVenta>(`${this.url}/detail/${id}`);
  }

  generateReports(proveedorId: number): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/${proveedorId}`);
  }

  create(formData: FormData): Observable<PuntoVenta> {
    return this.http.post<PuntoVenta>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<PuntoVenta> {
    return this.http.put<PuntoVenta>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<PuntoVenta> {
    return this.http.delete<PuntoVenta>(`${this.url}/${id}`);
  }
}
