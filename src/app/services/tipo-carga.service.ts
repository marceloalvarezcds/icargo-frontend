import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoCarga } from 'src/app/interfaces/tipo-carga';

@Injectable({
  providedIn: 'root'
})
export class TipoCargaService {

  private url = `${environment.api}/tipo_carga`;

  constructor(private http: HttpClient) { }

  getList(): Observable<TipoCarga[]> {
    return this.http.get<TipoCarga[]>(`${this.url}/`);
  }
}
