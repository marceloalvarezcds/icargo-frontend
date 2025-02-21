import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forEach } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ciudad } from 'src/app/interfaces/ciudad';
import { PaginatedList, PaginatedListRequest } from 'src/app/interfaces/paginate-list';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  private url = `${environment.api}/ciudad`;

  constructor(private http: HttpClient) {}

  getList(localidadId: number): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.url}/${localidadId}`)
      .pipe(
        map((resp:Ciudad[])=>{
          resp.map((item:Ciudad)=> {
            item.estado = 'Activo';
          })
          return resp;
        })
      );
  }


  getPaginatedList(request: PaginatedListRequest): Observable<PaginatedList<Ciudad>> {
    return this.http.get<PaginatedList<Ciudad>>(`${this.url}/?page=${request.page}&pageSize=${request.pageSize}&query=${request.query}`)
        .pipe(
          map((resp:PaginatedList<Ciudad>)=>{
            resp.rows.map((item:Ciudad)=> {
              item.estado = 'Activo';
              return item;
            })
            return resp;
          })
        );
  }
}
