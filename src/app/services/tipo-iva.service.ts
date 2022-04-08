import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoIva } from 'src/app/interfaces/tipo-iva';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoIvaService {
  private url = `${environment.api}/tipo_iva`;

  constructor(private http: HttpClient) {}

  getList(): Observable<TipoIva[]> {
    return this.http.get<TipoIva[]>(`${this.url}/`);
  }
}
