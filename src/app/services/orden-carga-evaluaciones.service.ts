import { Injectable } from '@angular/core';
import { OrdenCargaEvaluacionesHistorial } from '../interfaces/orden_carga_evaluacion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenCargaEvaluacionesService {

  private url = `${environment.api}/orden_carga_evaluacion`;

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<OrdenCargaEvaluacionesHistorial> {
    return this.http.post<OrdenCargaEvaluacionesHistorial>(`${this.url}/`, formData);
  }

}
