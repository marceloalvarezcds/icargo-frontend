import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MarcaSemi } from 'src/app/interfaces/marca-semi';

@Injectable({
  providedIn: 'root'
})
export class MarcaSemiService {

  private url = `${environment.api}/marca_semi`;

  constructor(private http: HttpClient) { }

  getList(): Observable<MarcaSemi[]> {
    return this.http.get<MarcaSemi[]>(`${this.url}/`);
  }
}
