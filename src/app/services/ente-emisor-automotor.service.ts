import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EnteEmisorAutomotor } from 'src/app/interfaces/ente-emisor-automotor';

@Injectable({
  providedIn: 'root'
})
export class EnteEmisorAutomotorService {

  private url = `${environment.api}/ente_emisor_automotor`;

  constructor(private http: HttpClient) { }

  getList(): Observable<EnteEmisorAutomotor[]> {
    return this.http.get<EnteEmisorAutomotor[]>(`${this.url}/`);
  }
}
