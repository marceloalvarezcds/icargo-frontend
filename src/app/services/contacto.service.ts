import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Contacto } from '../interfaces/contacto';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private url = `${environment.api}/contacto`;

  constructor(private http: HttpClient) { }

  get(telefono: string, email: string): Observable<Contacto> {
    return this.http.get<Contacto>(`${this.url}/${telefono}/${email}`).pipe(filter(d => !!d));
  }
}
