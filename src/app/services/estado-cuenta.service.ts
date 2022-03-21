import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';

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
      `${this.url}/tipo_contraparte/${tipo_contraparte_id}/contraparte/${contraparte}/numero_documento/${contraparte_numero_documento}`
    );
  }

  getListByGestorCarga(): Observable<EstadoCuenta[]> {
    return this.http.get<EstadoCuenta[]>(`${this.url}/gestor_carga_id/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }
}
