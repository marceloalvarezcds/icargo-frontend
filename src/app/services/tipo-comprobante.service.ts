import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoComprobante } from 'src/app/interfaces/tipo-comprobante';


@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService {

  private url = `${environment.api}/tipo_comprobante`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoComprobante[]> {
    return this.http.get<TipoComprobante[]>(`${this.url}/`);
  }
}
