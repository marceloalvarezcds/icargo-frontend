import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnteEmisorTransporte } from 'src/app/interfaces/ente-emisor-transporte';

@Injectable({
  providedIn: 'root'
})
export class EnteEmisorTransporteService {

  private url = `${environment.api}/ente_emisor_transporte`;

  constructor(private http: HttpClient) { }

  getList(): Observable<EnteEmisorTransporte[]> {
    return this.http.get<EnteEmisorTransporte[]>(`${this.url}/`);
  }
}
