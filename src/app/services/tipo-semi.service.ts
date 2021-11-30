import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoSemi } from 'src/app/interfaces/tipo-semi';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoSemiService {

  private url = `${environment.api}/tipo_semi`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoSemi[]> {
    return this.http.get<TipoSemi[]>(`${this.url}/`);
  }
}
