import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CentroOperativoClasificacion } from '../interfaces/centro-operativo-clasificacion';

@Injectable({
  providedIn: 'root'
})
export class CentroOperativoClasificacionService {

  private url = `${environment.api}/centro_operativo_clasificacion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<CentroOperativoClasificacion[]> {
    return this.http.get<CentroOperativoClasificacion[]>(`${this.url}/`);
  }
}
