import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from 'src/app/interfaces/factura';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private url = `${environment.api}/factura`;

  constructor(private http: HttpClient) {}

  getListByLiquidacionId(liquidacionId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(
      `${this.url}/liquidacion/${liquidacionId}/`
    );
  }

  getById(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<Factura> {
    return this.http.post<Factura>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Factura> {
    return this.http.put<Factura>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Factura> {
    return this.http.delete<Factura>(`${this.url}/${id}`);
  }
}
