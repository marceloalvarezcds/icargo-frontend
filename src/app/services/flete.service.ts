import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Flete, FleteList } from 'src/app/interfaces/flete';
import { FleteDestinatario } from '../interfaces/flete-destinatario';

@Injectable({
  providedIn: 'root',
})
export class FleteService {
  private url = `${environment.api}/flete`;

  constructor(private http: HttpClient) {}

  getList(): Observable<FleteList[]> {
    return this.http.get<FleteList[]>(`${this.url}/`);
  }

  getListByGestorCarga(): Observable<FleteList[]> {
    return this.http.get<FleteList[]>(`${this.url}/gestor_carga`);
  }

  getById(id: number): Observable<Flete> {
    return this.http.get<Flete>(`${this.url}/${id}`);
  }

  getFleteListById(id: number): Observable<FleteList> {
    return this.http.get<FleteList>(`${this.url}/flete-list/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<Flete> {
    return this.http.post<Flete>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<Flete> {
    return this.http.put<Flete>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<Flete> {
    return this.http.delete<Flete>(`${this.url}/${id}`);
  }

  cancel(id: number): Observable<Flete> {
    return this.http.get<Flete>(`${this.url}/${id}/cancel`);
  }

  inactive(id: number): Observable<Flete> {
    return this.http.get<Flete>(`${this.url}/${id}/inactive/flete`);
  }

  active(id: number): Observable<Flete> {
    return this.http.get<Flete>(`${this.url}/${id}/active/flete`);
  }

  updateCantidad(id: number, condicion_cantidad: string): Observable<Flete> {
    return this.http.put<Flete>(`${this.url}/${id}/cantidad`, { condicion_cantidad });
  }

  updateEditMode(id: number, isEdit: boolean): Observable<Flete> {
    return this.http.put<Flete>(`${this.url}/${id}/edit-mode`, { is_edit: isEdit });
  }

  getDestinatarioList(
    remitenteId: number,
    origenId: number,
    destinoId: number
  ): Observable<FleteDestinatario[]> {
    return this.http.get<FleteDestinatario[]>(
      `${this.url}/destinatarios/${remitenteId}/${origenId}/${destinoId}`
    );
  }

  getListByGestorCargaAndOc(): Observable<FleteList[]> {
    return this.http.get<FleteList[]>(`${this.url}/orden_carga/list`);
  }

  getListFleteListById(id: number): Observable<FleteList[]> {
    return this.http.get<FleteList[]>(`${this.url}/orden_carga/list/${id}`);
  }

}
