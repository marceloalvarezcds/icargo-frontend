import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoEvaluacion } from '../interfaces/tipo_evaluacion';

@Injectable({
  providedIn: 'root'
})
export class TipoEvaluacionService {

  private url = `${environment.api}/tipo_evaluacion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoEvaluacion[]> {
    return this.http.get<TipoEvaluacion[]>(`${this.url}/`);
  }
}
