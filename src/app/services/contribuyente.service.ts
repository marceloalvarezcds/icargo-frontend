import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contribuyente } from '../interfaces/contribuyente';

@Injectable({
  providedIn: 'root'
})
export class ContribuyenteService {

  private url = `${environment.api}/contribuyente`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Contribuyente[]> {
    return this.http.get<Contribuyente[]>(`${this.url}/`);
  }

}
