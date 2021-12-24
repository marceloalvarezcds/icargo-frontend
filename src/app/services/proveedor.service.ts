import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proveedor, ProveedorList } from 'src/app/interfaces/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private url = `${environment.api}/proveedor`;

  constructor(private http: HttpClient) { }

  getList(): Observable<ProveedorList[]> {
    return this.http.get<ProveedorList[]>(`${this.url}/`);
  }

  getListByGestorCuentaId(): Observable<ProveedorList[]> {
    return this.http.get<ProveedorList[]>(`${this.url}/gestor_cuenta_id/`);
  }

  getById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  create(formData: FormData): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${this.url}/${id}`);
  }
}
