import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoConceptoComplementoService {

  private url = `${environment.api}/tipo_concepto_complemento`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoConceptoComplemento[]> {
    return this.http.get<TipoConceptoComplemento[]>(`${this.url}/`);
  }
}
