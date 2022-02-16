import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { change } from 'src/app/utils/observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FleteAnticipoService {

  private url = `${environment.api}/flete_anticipo`;

  constructor(private http: HttpClient) { }

  getByTipoIdAndFleteId(tipoId: number, fleteId: number): Observable<FleteAnticipo> {
    return change(this.http.get<FleteAnticipo | null>(`${this.url}/tipo/${tipoId}/flete/${fleteId}`));
  }

  getByTipoIdAndFleteIdAndTipoInsumoId(tipoId: number, fleteId: number, tipoInsumoId: number): Observable<FleteAnticipo> {
    return change(this.http.get<FleteAnticipo | null>(`${this.url}/tipo/${tipoId}/flete/${fleteId}/tipo_insumo/${tipoInsumoId}`));
  }
}
