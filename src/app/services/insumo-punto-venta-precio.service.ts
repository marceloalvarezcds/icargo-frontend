import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InsumoPuntoVentaPrecio,
  InsumoPuntoVentaPrecioList,
} from 'src/app/interfaces/insumo-punto-venta-precio';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsumoPuntoVentaPrecioService {
  private url = `${environment.api}/insumo_punto_venta_precio`;

  constructor(private http: HttpClient) {}

  getList(): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(`${this.url}/`);
  }

  getListByFleteId(fleteId: number): Observable<InsumoPuntoVentaPrecioList[]> {
    return this.http.get<InsumoPuntoVentaPrecioList[]>(
      `${this.url}/flete/${fleteId}`
    );
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
}
