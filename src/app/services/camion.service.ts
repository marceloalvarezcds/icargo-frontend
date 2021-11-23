import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CamionList, mockCamionList } from 'src/app/interfaces/camion';

@Injectable({
  providedIn: 'root'
})
export class CamionService {

  private url = `${environment.api}/camion`;

  constructor(private http: HttpClient) { }

  getListByPropietarioId(propietarioId: number): Observable<CamionList[]> {
    return of(mockCamionList);
  }
}
