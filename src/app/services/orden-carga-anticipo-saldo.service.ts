import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCargaAnticipoSaldo } from '../interfaces/orden-carga-anticipo-saldo';
import { change } from '../utils/observable';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaAnticipoSaldoService {

  private url = `${environment.api}/orden_carga_anticipo_saldo`;

  constructor(private http: HttpClient) { }

  getByFleteAnticipoIdAndOrdenCargaId(fleteAnticipoId: number, ordenCargaId: number): Observable<OrdenCargaAnticipoSaldo> {
    return change(this.http.get<OrdenCargaAnticipoSaldo | null>(`${this.url}/flete_anticipo/${fleteAnticipoId}/orden_carga/${ordenCargaId}`));
  }
}
