import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rentabilidad } from 'src/app/interfaces/rentabilidad';

@Injectable({
  providedIn: 'root',
})
export class RentabilidadService {
  private url = `${environment.api}/rentabilidad`;

  constructor(private http: HttpClient) {}

  getList(): Observable<Rentabilidad[]> {
    return this.http.get<Rentabilidad[]>(`${this.url}/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }
}
