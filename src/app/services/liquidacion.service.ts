import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { getParams } from 'src/app/utils/contraparte-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  private url = `${environment.api}/liquidacion`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.url}/`, formData);
  }

  delete(id: number): Observable<Liquidacion> {
    return this.http.delete<Liquidacion>(`${this.url}/${id}`);
  }

  generateReportsByEstadoCuenta(
    estadoCuenta: EstadoCuenta,
    etapa: LiquidacionEtapaEnum
  ): Observable<string> {
    return this.http.get<string>(
      `${this.url}/reports/${getParams(estadoCuenta, etapa)}`
    );
  }

  getById(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.url}/${id}`);
  }

  getListByEstadoCuenta(
    estadoCuenta: EstadoCuenta,
    etapa: LiquidacionEtapaEnum
  ): Observable<Liquidacion[]> {
    return this.http.get<Liquidacion[]>(
      `${this.url}/${getParams(estadoCuenta, etapa)}`
    );
  }

  addMovimientos(id: number, formData: FormData): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(
      `${this.url}/${id}/add_movimientos`,
      formData
    );
  }

  removeMovimiento(id: number, formData: FormData): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(
      `${this.url}/${id}/remove_movimiento`,
      formData
    );
  }

  aceptar(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.url}/${id}/aceptar`);
  }

  cancelar(id: number): Observable<Liquidacion> {
    return this.http.get<Liquidacion>(`${this.url}/${id}/cancelar`);
  }

  rechazar(id: number, formData: FormData): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(`${this.url}/${id}/rechazar`, formData);
  }

  pasarARevision(id: number, formData: FormData): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(
      `${this.url}/${id}/en_revision`,
      formData
    );
  }

  addInstrumentos(id: number, formData: FormData): Observable<Liquidacion> {
    return this.http.patch<Liquidacion>(
      `${this.url}/${id}/add_instrumentos`,
      formData
    );
  }

  pdf(id: number, etapa: LiquidacionEtapaEnum): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf/etapa/${etapa}`);
  }
}
