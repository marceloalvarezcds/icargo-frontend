import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Localidad } from '../interfaces/localidad';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  private url = `${environment.api}/localidad`;

  constructor(private http: HttpClient) { }

  getList(paisId: number): Observable<Localidad[]> {
    return this.http.get<Localidad[]>(`${this.url}/${paisId}/`);
  }
}
