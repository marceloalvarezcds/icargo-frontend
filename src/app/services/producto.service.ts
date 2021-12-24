import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Producto } from 'src/app/interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = `${environment.api}/producto`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/`);
  }
}
