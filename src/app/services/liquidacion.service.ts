import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
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
    estado: EstadoEnum
  ): Observable<string> {
    const contraparte = encodeURIComponent(estadoCuenta.contraparte);
    return this.http.get<string>(
      `${this.url}/reports/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
    );
  }

  getListByEstadoCuenta(
    estadoCuenta: EstadoCuenta,
    estado: EstadoEnum
  ): Observable<Liquidacion[]> {
    const contraparte = encodeURIComponent(estadoCuenta.contraparte);
    return this.http.get<Liquidacion[]>(
      `${this.url}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
    );
  }
}
