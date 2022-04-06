import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstrumentoService {
  private url = `${environment.api}/instrumento`;

  constructor(private http: HttpClient) {}

  confirmar(id: number): Observable<Instrumento> {
    return this.http.get<Instrumento>(`${this.url}/${id}/confirmar`);
  }

  rechazar(id: number): Observable<Instrumento> {
    return this.http.get<Instrumento>(`${this.url}/${id}/rechazar`);
  }
}
