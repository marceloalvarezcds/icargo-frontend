import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flete, FleteList } from 'src/app/interfaces/flete';

@Injectable({
  providedIn: 'root'
})
export class FleteService {

  private url = `${environment.api}/flete`;

  constructor(private http: HttpClient) { }

  getList(): Observable<FleteList[]> {
    return this.http.get<FleteList[]>(`${this.url}/`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports/`);
  }

  delete(id: number): Observable<Flete> {
    return this.http.delete<Flete>(`${this.url}/${id}`);
  }
}
