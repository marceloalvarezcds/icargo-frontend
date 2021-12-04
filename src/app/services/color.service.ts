import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Color } from 'src/app/interfaces/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private url = `${environment.api}/color`;

  constructor(private http: HttpClient) { }

  getList(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.url}/`);
  }
}
