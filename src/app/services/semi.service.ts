import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Semi, SemiList } from 'src/app/interfaces/semi';

@Injectable({
  providedIn: 'root'
})
export class SemiService {

  private url = `${environment.api}/semi`;

  constructor(private http: HttpClient) { }

  getListByPropietarioId(propietarioId: number): Observable<SemiList[]> {
    return this.http.get<SemiList[]>(`${this.url}/propietario/${propietarioId}/`);
  }
}
