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

  getById(id: number): Observable<CentroOperativo> {
    return this.http.get<CentroOperativo>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<CentroOperativo> {
    return this.http.post<CentroOperativo>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<CentroOperativo> {
    return this.http.put<CentroOperativo>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<CentroOperativo> {
    return this.http.delete<CentroOperativo>(`${this.url}/${id}`);
  }
}
