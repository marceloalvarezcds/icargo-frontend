import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoIncidente } from '../interfaces/tipo_evaluacion';

@Injectable({
  providedIn: 'root'
})
export class TipoEvaluacionService {

  private url = `${environment.api}/tipo_incidente`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoIncidente[]> {
    return this.http.get<TipoIncidente[]>(`${this.url}/`);
  }
}
