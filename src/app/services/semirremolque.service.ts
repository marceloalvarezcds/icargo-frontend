import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mockSemirremolqueList, SemirremolqueList } from 'src/app/interfaces/semirremolque';

@Injectable({
  providedIn: 'root'
})
export class SemirremolqueService {

  private url = `${environment.api}/semirremolque`;

  constructor(private http: HttpClient) { }

  getListByPropietarioId(propietarioId: number): Observable<SemirremolqueList[]> {
    return of(mockSemirremolqueList);
  }
}
