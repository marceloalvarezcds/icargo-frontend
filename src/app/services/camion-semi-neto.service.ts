import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CamionSemiNeto } from 'src/app/interfaces/camion-semi-neto';

@Injectable({
  providedIn: 'root'
})
export class CamionSemiNetoService {

  private url = `${environment.api}/camion_semi_neto`;

  constructor(private http: HttpClient) { }

  getListByCamionIdAndSemiIdAndProductoId(camionId: number, semiId: number, productoId: number): Observable<CamionSemiNeto | null> {
    return this.http.get<CamionSemiNeto | null>(`${this.url}/camion/${camionId}/semi/${semiId}/producto/${productoId}`);
  }
}
