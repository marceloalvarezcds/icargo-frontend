import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { getParamsBy } from 'src/app/utils/contraparte-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadoCuentaService {
  private url = `${environment.api}/estado_cuenta`;

  constructor(private http: HttpClient) {}

  getByContraparte(
    tipo_contraparte_id: number,
    contraparte: string,
    contraparte_numero_documento: string
  ): Observable<EstadoCuenta | null> {
    return this.http.get<EstadoCuenta | null>(
      `${this.url}/${getParamsBy(
        tipo_contraparte_id,
        contraparte,
        contraparte_numero_documento
      )}`
    );
  }

  getListByGestorCarga(): Observable<EstadoCuenta[]> {
    return this.http.get<EstadoCuenta[]>(`${this.url}/gestor_carga_id/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }
}
