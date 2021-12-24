import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoConceptoDescuento } from 'src/app/interfaces/tipo-concepto-descuento';

@Injectable({
  providedIn: 'root'
})
export class TipoConceptoDescuentoService {

  private url = `${environment.api}/tipo_concepto_descuento`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoConceptoDescuento[]> {
    return this.http.get<TipoConceptoDescuento[]>(`${this.url}/`);
  }
}
