import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CentroOperativo, CentroOperativoList } from '../interfaces/centro-operativo';

@Injectable({
  providedIn: 'root'
})
export class CentroOperativoService {

  private url = `${environment.api}/centro_operativo`;

  constructor(private http: HttpClient) { }

  getList(): Observable<CentroOperativoList[]> {
    return this.http.get<CentroOperativoList[]>(`${this.url}/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<CentroOperativo> {
    return this.http.post<CentroOperativo>(`${this.url}/`, formData);
  }
}
