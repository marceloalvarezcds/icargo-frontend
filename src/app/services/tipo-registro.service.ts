import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoRegistro } from 'src/app/interfaces/tipo-registro';

@Injectable({
  providedIn: 'root'
})
export class TipoRegistroService {

  private url = `${environment.api}/tipo_registro`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoRegistro[]> {
    return this.http.get<TipoRegistro[]>(`${this.url}/`);
  }
}
