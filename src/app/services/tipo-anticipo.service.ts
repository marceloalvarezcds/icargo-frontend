import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';

@Injectable({
  providedIn: 'root'
})
export class TipoAnticipoService {

  private url = `${environment.api}/tipo_anticipo`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoAnticipo[]> {
    return this.http.get<TipoAnticipo[]>(`${this.url}/`);
  }

  getListByFleteId(fleteId: number): Observable<TipoAnticipo[]> {
    return this.http.get<TipoAnticipo[]>(`${this.url}/flete/${fleteId}`);
  }
}
