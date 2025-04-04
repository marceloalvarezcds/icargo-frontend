import { Injectable } from '@angular/core';
import { MonedaCotizacion } from '../interfaces/moneda_cotizacion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonedaCotizacionService {
  private url = `${environment.api}/moneda_cotizacion`;
  constructor(private http: HttpClient) {}

  get_cotizacion_by_moneda(
    moneda_origen_id: number,
    moneda_destino_id: number,
  ): Observable<MonedaCotizacion | null> {  // Cambiado a MonedaCotizacion (único objeto)
    return this.http.get<MonedaCotizacion | null>(
      `${this.url}/cotizacion/moneda_origen/${moneda_origen_id}/moneda_destino/${moneda_destino_id}`
    );
  }


}
