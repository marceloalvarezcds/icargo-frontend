import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InsumoPuntoVenta } from '../interfaces/insumo-punto-venta';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsumoPuntoVentaService {
  private url = `${environment.api}/insumo_punto_venta`;
  constructor(private http: HttpClient) { }

  getList(): Observable<InsumoPuntoVenta[]> {
    return this.http.get<InsumoPuntoVenta[]>(`${this.url}/`);
  }

  getListInsumoByPdvId(punto_venta_id: number): Observable<InsumoPuntoVenta[]> {
    return this.http.get<InsumoPuntoVenta[]>(
      `${this.url}/${punto_venta_id}`
    );
  }
}
