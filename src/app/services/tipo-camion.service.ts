import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoCamion } from 'src/app/interfaces/tipo-camion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoCamionService {

  private url = `${environment.api}/tipo_camion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoCamion[]> {
    return this.http.get<TipoCamion[]>(`${this.url}/`);
  }
}
