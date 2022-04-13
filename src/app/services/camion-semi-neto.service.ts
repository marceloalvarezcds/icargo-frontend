import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CamionSemiNeto } from 'src/app/interfaces/camion-semi-neto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CamionSemiNetoService {
  private url = `${environment.api}/camion_semi_neto`;

  constructor(private http: HttpClient) {}

  getListByCamionId(camionId: number): Observable<CamionSemiNeto[]> {
    return this.http.get<CamionSemiNeto[]>(`${this.url}/camion/${camionId}`);
  }

  getListByCamionIdAndSemiIdAndProductoId(
    camionId: number,
    semiId: number,
    productoId: number
  ): Observable<CamionSemiNeto | null> {
    return this.http.get<CamionSemiNeto | null>(
      `${this.url}/camion/${camionId}/semi/${semiId}/producto/${productoId}`
    );
  }

  getById(id: number): Observable<CamionSemiNeto> {
    return this.http.get<CamionSemiNeto>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<CamionSemiNeto> {
    return this.http.post<CamionSemiNeto>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<CamionSemiNeto> {
    return this.http.put<CamionSemiNeto>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<CamionSemiNeto> {
    return this.http.delete<CamionSemiNeto>(`${this.url}/${id}`);
  }
}
