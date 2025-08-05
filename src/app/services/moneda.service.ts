import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Moneda } from '../interfaces/moneda';

@Injectable({
  providedIn: 'root'
})
export class MonedaService {

  private url = `${environment.api}/moneda`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(`${this.url}/`);
  }

  getListByInsumoIdAndPuntoVentaId(insumoId: number, puntoVentaId: number): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(`${this.url}/insumo/${insumoId}/punto_venta/${puntoVentaId}`);
  }

  getMonedaByGestorId(gestorId: number): Observable<Moneda>{
    return this.http.get<Moneda>(`${this.url}/moneda/${gestorId}`);
  }
}
