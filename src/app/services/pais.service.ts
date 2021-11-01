import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pais } from '../interfaces/pais';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private url = `${environment.api}/pais`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Pais[]> {
    return this.http.get<Pais[]>(`${this.url}/`);
  }
}
