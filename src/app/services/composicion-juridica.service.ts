import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComposicionJuridica } from '../interfaces/composicion-juridica';

@Injectable({
  providedIn: 'root'
})
export class ComposicionJuridicaService {

  private url = `${environment.api}/composicion_juridica`;

  constructor(private http: HttpClient) { }

  getList(): Observable<ComposicionJuridica[]> {
    return this.http.get<ComposicionJuridica[]>(`${this.url}/`);
  }
}
