import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComentariosFlota } from '../interfaces/comentarios-flota-dialog-data';
@Injectable({
  providedIn: 'root'
})
export class ComentarioFlotaService {

  private url = `${environment.api}/comentarios_flota`;

  constructor(private http: HttpClient) { }

  create(formData: FormData): Observable<ComentariosFlota> {
    return this.http.post<ComentariosFlota>(`${this.url}/`, formData);
  }

  getByEntidad(comentable_type: string, comentable_id: number): Observable<ComentariosFlota[]> {
     return this.http.get<ComentariosFlota[]>(`${this.url}/${comentable_type}/${comentable_id}`);
  }

  downloadFileByFilename(filename: string): Observable<Blob> {
  return this.http.get(`${this.url}archivo/${filename}`, {
    responseType: 'blob'
  });
}

}
