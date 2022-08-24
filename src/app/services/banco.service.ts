import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banco } from 'src/app/interfaces/banco';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BancoService {
  private url = `${environment.api}/banco`;

  constructor(private http: HttpClient) {}

  getListByGestorCarga(): Observable<Banco[]> {
    return this.http.get<Banco[]>(`${this.url}/gestor_carga_id`);
  }

  getById(id: number): Observable<Banco> {
    return this.http.get<Banco>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Banco> {
    return this.http.post<Banco>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Banco> {
    return this.http.put<Banco>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Banco> {
    return this.http.delete<Banco>(`${this.url}/${id}`);
  }
}
