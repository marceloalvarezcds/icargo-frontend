import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoInsumo } from 'src/app/interfaces/tipo-insumo';

@Injectable({
  providedIn: 'root'
})
export class TipoInsumoService {

  private url = `${environment.api}/tipo_insumo`;

  constructor(private http: HttpClient) { }

  getListByFleteId(fleteId: number): Observable<TipoInsumo[]> {
    return this.http.get<TipoInsumo[]>(`${this.url}/flete/${fleteId}`);
  }
}
