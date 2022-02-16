import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Insumo } from 'src/app/interfaces/insumo';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private url = `${environment.api}/insumo`;

  constructor(private http: HttpClient) { }

  getListByTipoInsumoId(tipoInsumoId: number): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.url}/tipo_insumo/${tipoInsumoId}/`);
  }
}
