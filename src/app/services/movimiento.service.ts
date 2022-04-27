import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { ContraparteInfo } from 'src/app/interfaces/contraparte-info';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { getParams } from 'src/app/utils/contraparte-info';
import { environment } from 'src/environments/environment';
import { Liquidacion } from '../interfaces/liquidacion';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private url = `${environment.api}/movimiento`;

  constructor(private http: HttpClient) {}

  getListByEstadoCuenta(
    estadoCuenta: ContraparteInfo,
    etapa: LiquidacionEtapaEnum
  ): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${this.url}/${getParams(estadoCuenta, etapa)}`
    );
  }

  getListByLiquidacion(
    liquidacion: Liquidacion,
    etapa: LiquidacionEtapaEnum
  ): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${this.url}/liquidacion/${liquidacion.id}/etapa/${etapa}`
    );
  }

  getById(id: number): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Movimiento> {
    return this.http.delete<Movimiento>(`${this.url}/${id}`);
  }
}
