import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InsumoPuntoVentaPrecio,
  InsumoPuntoVentaPrecioForm,
  InsumoPuntoVentaPrecioList,
} from 'src/app/interfaces/insumo-punto-venta-precio';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsumoPuntoVentaPrecioService {
  private url = `${environment.api}/insumo_punto_venta_precio`;

  constructor(private http: HttpClient) {}

  getByActivosList(): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(`${this.url}/gestor-carga/activo`);
  }

  getList(): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(`${this.url}/`);
  }

  getInactiveList(): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(`${this.url}/inactivos`);
  }

  getById(id: number): Observable<InsumoPuntoVentaPrecioList> {
    return this.http.get<InsumoPuntoVentaPrecioList>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  getListByFleteId(fleteId: number): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(
      `${this.url}/flete/${fleteId}`
    );
  }

  getListByPuntoVentaId(pdvId: number): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(
      `${this.url}/insumos/punto_venta/${pdvId}`
    );
  }

  create(formData: FormData): Observable<InsumoPuntoVentaPrecio> {
    return this.http.post<InsumoPuntoVentaPrecio>(`${this.url}/`, formData);
  }

  createMercaderia(formData: FormData): Observable<InsumoPuntoVentaPrecio> {
    return this.http.post<InsumoPuntoVentaPrecio>(`${this.url}/nueva/mercaderia`, formData);
  }

  edit(id: number, formData: FormData): Observable<InsumoPuntoVentaPrecioForm> {
    return this.http.put<InsumoPuntoVentaPrecioForm>(`${this.url}/${id}`, formData);
  }

  getByInsumoIdAndMonedaIdAndPuntoVentaId(
    insumoId: number,
    monedaId: number,
    puntoVentaId: number
  ): Observable<InsumoPuntoVentaPrecio | null> {
    return this.http.get<InsumoPuntoVentaPrecio | null>(
      `${this.url}/insumo/${insumoId}/moneda/${monedaId}/punto_venta/${puntoVentaId}`
    );
  }

  inactive(id: number): Observable<InsumoPuntoVentaPrecio> {
    return this.http.get<InsumoPuntoVentaPrecio>(`${this.url}/${id}/inactive`);
  }

  active(id: number): Observable<InsumoPuntoVentaPrecio> {
    return this.http.get<InsumoPuntoVentaPrecio>(`${this.url}/${id}/active`);
  }
}
