import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Remitente, RemitenteList } from '../interfaces/remitente';

@Injectable({
  providedIn: 'root',
})
export class RemitenteService {
  private url = `${environment.api}/remitente`;

  constructor(private http: HttpClient) {}

  getList(): Observable<RemitenteList[]> {
    return this.http.get<RemitenteList[]>(`${this.url}/`);
  }

  getListByGestorCuentaId(): Observable<RemitenteList[]> {
    return this.http.get<RemitenteList[]>(`${this.url}/gestor_cuenta_id`);
  }

  getById(id: number): Observable<Remitente> {
    return this.http.get<Remitente>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Remitente> {
    return this.http.post<Remitente>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Remitente> {
    return this.http.put<Remitente>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Remitente> {
    return this.http.delete<Remitente>(`${this.url}/${id}`);
  }
}
