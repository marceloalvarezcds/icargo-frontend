import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContraparteWithId } from 'src/app/interfaces/contraparte-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContraparteService {
  private url = `${environment.api}/contraparte`;

  constructor(private http: HttpClient) {}

  getListByTipoContraparteId(
    tipoContraparteId: number
  ): Observable<ContraparteWithId[]> {
    return this.http.get<ContraparteWithId[]>(
      `${this.url}/tipo_contraparte/${tipoContraparteId}`
    );
  }
}
