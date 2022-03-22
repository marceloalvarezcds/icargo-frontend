import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
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
    const contrapart = encodeURIComponent(contraparte);
    return this.http.get<EstadoCuenta | null>(
      `${this.url}/tipo_contraparte/${tipo_contraparte_id}/contraparte/${contrapart}/numero_documento/${contraparte_numero_documento}`
    );
  }

  getListByGestorCarga(): Observable<EstadoCuenta[]> {
    return this.http.get<EstadoCuenta[]>(`${this.url}/gestor_carga_id/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }
}
