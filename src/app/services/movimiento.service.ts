import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private url = `${environment.api}/movimiento`;

  constructor(private http: HttpClient) {}

  getListByEstadoCuenta(
    estadoCuenta: EstadoCuenta,
    estado: EstadoEnum
  ): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(
      `${this.url}/tipo_contraparte/${estadoCuenta.tipo_contraparte_id}/contraparte/${estadoCuenta.contraparte}/numero_documento/${estadoCuenta.contraparte_numero_documento}/estado/${estado}`
    );
  }
}
