import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SemiClasificacion } from 'src/app/interfaces/semi-clasificacion';

@Injectable({
  providedIn: 'root'
})
export class SemiClasificacionService {

  private url = `${environment.api}/semi_clasificacion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<SemiClasificacion[]> {
    return this.http.get<SemiClasificacion[]>(`${this.url}/`);
  }
}
