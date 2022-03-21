import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  private url = `${environment.api}/liquidacion`;

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<Liquidacion> {
    return this.http.post<Liquidacion>(`${this.url}/`, formData);
  }
}
