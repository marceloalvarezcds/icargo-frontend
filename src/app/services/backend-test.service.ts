import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

type Alive = { alive: boolean };

@Injectable({
  providedIn: 'root',
})
export class BackendTestService {
  private url = `${environment.api}/alive`;

  constructor(private http: HttpClient) {}

  alive(): Observable<Alive> {
    return this.http.get<Alive>(this.url);
  }
}
