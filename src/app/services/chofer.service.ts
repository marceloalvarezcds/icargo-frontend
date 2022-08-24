import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Chofer, ChoferList } from 'src/app/interfaces/chofer';

@Injectable({
  providedIn: 'root',
})
export class ChoferService {
  private url = `${environment.api}/chofer`;

  constructor(private http: HttpClient) {}

  getList(): Observable<ChoferList[]> {
    return this.http.get<ChoferList[]>(`${this.url}/`);
  }

  getListByGestorCuenta(): Observable<ChoferList[]> {
    return this.http.get<ChoferList[]>(`${this.url}/gestor_cuenta`);
  }

  getListByWithoutCamion(): Observable<ChoferList[]> {
    return this.http.get<ChoferList[]>(`${this.url}/without_camion`);
  }

  getById(id: number): Observable<Chofer> {
    return this.http.get<Chofer>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Chofer> {
    return this.http.post<Chofer>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Chofer> {
    return this.http.put<Chofer>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Chofer> {
    return this.http.delete<Chofer>(`${this.url}/${id}`);
  }

  active(id: number): Observable<Chofer> {
    return this.http.get<Chofer>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<Chofer> {
    return this.http.get<Chofer>(`${this.url}/${id}/inactive`);
  }
}
