import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Unidad } from 'src/app/interfaces/unidad';

@Injectable({
  providedIn: 'root'
})
export class UnidadService {

  private url = `${environment.api}/unidad`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(`${this.url}/`);
  }
}
