import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TextoLegal } from '../interfaces/texto-legal';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TextoLegalService {

  private url = `${environment.api}/texto_legal`;

  constructor(private http: HttpClient) {}

  getActiveList(): Observable<TextoLegal[]> {
    return this.http.get<TextoLegal[]>(`${this.url}/gestor_carga_id`);
  }

  getList(): Observable<TextoLegal[]> {
    return this.http.get<TextoLegal[]>(`${this.url}/`)
      .pipe(
        map((resp:TextoLegal[])=> {
          resp.map(texto=>{
            texto.texto_legal = texto.titulo + ' - ' + texto.descripcion
          })
          return resp;
        })
      );
  }

  geItemByTitletList(title: string): Observable<TextoLegal> {
    return this.http.get<TextoLegal>(`${this.url}/title/get_by_title?title=${title}`);
  }

  getById(id: number): Observable<TextoLegal> {
    return this.http.get<TextoLegal>(`${this.url}/${id}`);
  }

  create(formData: FormData): Observable<TextoLegal> {
    return this.http.post<TextoLegal>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<TextoLegal> {
    return this.http.put<TextoLegal>(`${this.url}/${id}`, formData);
  }

  active(id: number): Observable<TextoLegal> {
    return this.http.get<TextoLegal>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<TextoLegal> {
    return this.http.get<TextoLegal>(`${this.url}/${id}/inactive`);
  }

}
