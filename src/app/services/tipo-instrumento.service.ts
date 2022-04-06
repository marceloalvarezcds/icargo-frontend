import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoInstrumento } from 'src/app/interfaces/tipo-instrumento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoInstrumentoService {
  private url = `${environment.api}/tipo_instrumento`;

  constructor(private http: HttpClient) {}

  getListViaBanco(): Observable<TipoInstrumento[]> {
    return this.http.get<TipoInstrumento[]>(`${this.url}/via_banco`);
  }
}
