import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FleteAnticipo,
  FleteAnticipoForm,
} from 'src/app/interfaces/flete-anticipo';
import { change } from 'src/app/utils/observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FleteAnticipoService {
  private url = `${environment.api}/flete_anticipo`;

  constructor(private http: HttpClient) {}

  getTipoAnticipoInsumoList(): Observable<FleteAnticipoForm[]> {
    return change(
      this.http.get<FleteAnticipoForm[]>(`${this.url}/tipo_anticipo_insumo/`)
    );
  }

  getByTipoIdAndFleteId(
    tipoId: number,
    fleteId: number
  ): Observable<FleteAnticipo> {
    return change(
      this.http.get<FleteAnticipo | null>(
        `${this.url}/tipo/${tipoId}/flete/${fleteId}`
      )
    );
  }

  getByTipoIdAndFleteIdAndTipoInsumoId(
    tipoId: number,
    fleteId: number,
    tipoInsumoId: number
  ): Observable<FleteAnticipo> {
    return change(
      this.http.get<FleteAnticipo | null>(
        `${this.url}/tipo/${tipoId}/flete/${fleteId}/tipo_insumo/${tipoInsumoId}`
      )
    );
  }
}
