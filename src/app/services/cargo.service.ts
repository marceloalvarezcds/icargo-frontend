import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cargo } from '../interfaces/cargo';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private url = `${environment.api}/cargo`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(`${this.url}/`);
  }
}
