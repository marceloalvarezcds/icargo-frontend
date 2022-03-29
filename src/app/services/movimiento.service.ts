import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { ContraparteInfo } from 'src/app/interfaces/contraparte-info';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { getParams } from 'src/app/utils/contraparte-info';
import { environment } from 'src/environments/environment';
import { EstadoEnum } from 'src/app/enums/estado-enum';

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
}
