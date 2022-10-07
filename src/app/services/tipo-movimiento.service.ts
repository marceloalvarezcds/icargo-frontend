import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoMovimiento } from '../interfaces/tipo-movimiento';

@Injectable({
  providedIn: 'root',
})
export class TipoMovimientoService {
  private url = `${environment.api}/tipo_movimiento`;

  constructor(private http: HttpClient) {}

  getActiveList(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(`${this.url}/active_list`);
  }

  getList(): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(`${this.url}/`);
  }

  getListByCuentaId(cuentaId: number): Observable<TipoMovimiento[]> {
    return this.http.get<TipoMovimiento[]>(`${this.url}/cuenta/${cuentaId}`);
  }

  getById(id: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<TipoMovimiento> {
    return this.http.post<TipoMovimiento>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<TipoMovimiento> {
    return this.http.put<TipoMovimiento>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<TipoMovimiento> {
    return this.http.get<TipoMovimiento>(`${this.url}/${id}/inactive`);
  }
}
