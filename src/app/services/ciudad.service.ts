import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ciudad, PaginatedList, PaginatedListRequest } from '../interfaces/ciudad';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  private url = `${environment.api}/ciudad`;

  constructor(private http: HttpClient) {}

  getList(localidadId: number): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.url}/${localidadId}/`);
  }


  getPaginatedList(request: PaginatedListRequest): Observable<PaginatedList<Ciudad>> {
    return this.http.get<PaginatedList<Ciudad>>(`${this.url}/?page=${request.page}&pageSize=${request.pageSize}&query=${request.query}`)
  }
}
