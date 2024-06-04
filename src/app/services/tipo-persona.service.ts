import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoPersona } from '../interfaces/tipo-persona';

@Injectable({
  providedIn: 'root'
})
export class TipoPersonaService {
  [x: string]: any;

  private url = `${environment.api}/tipo_persona`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoPersona[]> {
    return this.http.get<TipoPersona[]>(`${this.url}/`);
  }
  getListByTipoPersona(): Observable<TipoPersona[]> {
    return this.http.get<TipoPersona[]>(`${this.url}/tipo_persona`);
  }
}
