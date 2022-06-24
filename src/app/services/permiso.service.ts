import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permiso } from 'src/app/interfaces/permiso';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermisoService {
  private url = `${environment.api}/permiso`;

  constructor(private http: HttpClient) {}

  getList(): Observable<Permiso[]> {
    return this.http.get<Permiso[]>(`${this.url}/`);
  }
}
