import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstrumentoVia } from 'src/app/interfaces/instrumento-via';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstrumentoViaService {
  private url = `${environment.api}/instrumento_via`;

  constructor(private http: HttpClient) {}

  getList(): Observable<InstrumentoVia[]> {
    return this.http.get<InstrumentoVia[]>(`${this.url}/`);
  }
}
