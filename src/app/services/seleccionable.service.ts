import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeleccionableService {
  private url = '';

  constructor(private http: HttpClient) {}

  setEndpoint(endpoint: string): void {
    this.url = `${environment.api}/${endpoint}`;
  }

  getActiveList<T extends SeleccionableBaseModel>(): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}/active_list/`);
  }

  getList(): Observable<SeleccionableBaseModel[]> {
    return this.http.get<SeleccionableBaseModel[]>(`${this.url}/`);
  }

  getById(id: number): Observable<SeleccionableBaseModel> {
    return this.http.get<SeleccionableBaseModel>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<SeleccionableBaseModel> {
    return this.http.post<SeleccionableBaseModel>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<SeleccionableBaseModel> {
    return this.http.put<SeleccionableBaseModel>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<SeleccionableBaseModel> {
    return this.http.get<SeleccionableBaseModel>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<SeleccionableBaseModel> {
    return this.http.get<SeleccionableBaseModel>(`${this.url}/${id}/inactive`);
  }
}
