import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeleccionableService<T extends SeleccionableBaseModel> {
  private url = '';

  constructor(private http: HttpClient) {}

  setEndpoint(endpoint: string): void {
    this.url = `${environment.api}/${endpoint}`;
  }

  getActiveList(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}/active_list`);
  }

  getList(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}/`);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}/inactive`);
  }
}
