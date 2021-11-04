import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoDocumento } from '../interfaces/tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  private url = `${environment.api}/tipo_documento`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoDocumento[]> {
    return this.http.get<TipoDocumento[]>(`${this.url}/`);
  }
}
