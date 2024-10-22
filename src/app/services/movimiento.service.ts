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

  getListByGestorCarga(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.url}/gestor_carga_id`);
  }

  getListByEstadoCuenta(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number,
    etapa: LiquidacionEtapaEnum,
    punto_venta_id?: number,
  ): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${this.url}/${getParams(estadoCuenta, contraparte_id, etapa, punto_venta_id)}`
    );
  }

  getListByEstadoCuentaDetalle(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number,
    etapa?: LiquidacionEtapaEnum,
    punto_venta_id?: number,
  ): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${environment.api}/estado_cuenta/movimiento/${getParams(estadoCuenta, contraparte_id, etapa, punto_venta_id)}`
    );
  }

  getReportListByEstadoCuentaDetalle(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number,
    etapa?: LiquidacionEtapaEnum,
    punto_venta_id?: number,
  ): Observable<string> {
    return this.http.get<string>(
      `${environment.api}/estado_cuenta/report/movimiento/${getParams(estadoCuenta, contraparte_id, etapa, punto_venta_id)}`
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

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  generateReportsByEstadoCuenta(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number
  ): Observable<string> {
    return this.http.get<string>(
      `${this.url}/reports/${getParams(estadoCuenta, contraparte_id)}`
    );
  }

  generateReportsByContraparte(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number,
    estado: LiquidacionEtapaEnum
  ): Observable<string> {
    return this.http.get<string>(
      `${this.url}/reports/${getParams(estadoCuenta, contraparte_id, estado)}`
    );
  }

  generateReportsByEstadoAndLiquidacionId(
    estado: string,
    liquidacion_id: number
  ): Observable<string> {
    return this.http.get<string>(
      `${this.url}/reports/liquidacion/${liquidacion_id}/estado/${estado}`
    );
  }

  generateReportsByGestorCarga(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/gestor_carga_id`);
  }

  create(formData: FormData): Observable<Movimiento> {
    return this.http.post<Movimiento>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Movimiento> {
    return this.http.put<Movimiento>(`${this.url}/${id}`, formData);
  }

  editByGestorFlete(id: number, formData: FormData): Observable<Movimiento> {
    return this.http.put<Movimiento>(
      `${this.url}/${id}/edit_by_gestor_flete`,
      formData
    );
  }

  editByGestorMerma(id: number, formData: FormData): Observable<Movimiento> {
    return this.http.put<Movimiento>(
      `${this.url}/${id}/edit_by_gestor_merma`,
      formData
    );
  }

  editByPropietarioFlete(
    id: number,
    formData: FormData
  ): Observable<Movimiento> {
    return this.http.put<Movimiento>(
      `${this.url}/${id}/edit_by_propietario_flete`,
      formData
    );
  }

  editByPropietarioMerma(
    id: number,
    formData: FormData
  ): Observable<Movimiento> {
    return this.http.put<Movimiento>(
      `${this.url}/${id}/edit_by_propietario_merma`,
      formData
    );
  }

  delete(id: number): Observable<Movimiento> {
    return this.http.delete<Movimiento>(`${this.url}/${id}`);
  }

  getReportListByEstadoCuentaDetalle(
    estadoCuenta: ContraparteInfo,
    contraparte_id: number,
    etapa?: LiquidacionEtapaEnum,
    punto_venta_id?: number,
  ): Observable<string> {
    return this.http.get<string>(
      `${environment.api}/estado_cuenta/report/movimiento/${getParams(estadoCuenta, contraparte_id, etapa, punto_venta_id)}`
    );
  }


}
