import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarcaCamion } from 'src/app/interfaces/marca-camion';

@Injectable({
  providedIn: 'root'
})
export class MarcaCamionService {

  private url = `${environment.api}/marca_camion`;

  constructor(private http: HttpClient) { }

  getList(): Observable<MarcaCamion[]> {
    return this.http.get<MarcaCamion[]>(`${this.url}/`);
  }
}
