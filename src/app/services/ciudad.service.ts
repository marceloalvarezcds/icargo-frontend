import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ciudad } from '../interfaces/ciudad';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  private url = `${environment.api}/ciudad`;

  constructor(private http: HttpClient) {}

  getList(localidadId: number): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.url}/${localidadId}/`);
  }

  getAllList(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.url}/`);
  }
}
