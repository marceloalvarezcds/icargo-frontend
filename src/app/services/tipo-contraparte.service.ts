import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoContraparte } from 'src/app/interfaces/tipo-contraparte';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoContraparteService {
  private url = `${environment.api}/tipo_contraparte`;

  constructor(private http: HttpClient) {}

  getList(): Observable<TipoContraparte[]> {
    return this.http.get<TipoContraparte[]>(`${this.url}/`);
  }
}
