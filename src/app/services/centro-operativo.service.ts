import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CentroOperativo, mockCentroOperativoList } from '../interfaces/centro-operativo';

@Injectable({
  providedIn: 'root'
})
export class CentroOperativoService {

  private url = `${environment.api}/user/`;

  constructor(private http: HttpClient) { }

  getList(): Observable<CentroOperativo[]> {
    return of(mockCentroOperativoList);
  }
}
