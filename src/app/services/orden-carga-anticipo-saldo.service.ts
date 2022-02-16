import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdenCargaAnticipoSaldoService {
  private url = `${environment.api}/orden_carga_anticipo_saldo`;

  constructor(private http: HttpClient) {}

  getByFleteAnticipoIdAndOrdenCargaId(
    fleteAnticipoId: number,
    ordenCargaId: number
  ): Observable<number> {
    return this.http.get<number>(
      `${this.url}/flete_anticipo/${fleteAnticipoId}/orden_carga/${ordenCargaId}`
    );
  }
}
