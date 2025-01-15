import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { catchError, map } from 'rxjs/operators';
import { OrdenCargaComentariosHistorial } from '../interfaces/orden_carga_comentarios_historial';

@Injectable({
  providedIn: 'root',
})
export class OrdenCargaService {
  private url = `${environment.api}/orden_carga`;

  constructor(private http: HttpClient) {}

  getList(): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/`);
  }

  getById(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}`);
  }

  generateReports(): Observable<string> {
    return this.http.get<string>(`${this.url}/reports`);
  }

  create(formData: FormData): Observable<OrdenCarga> {
    return this.http.post<OrdenCarga>(`${this.url}/`, formData);
  }

  edit(id: number, formData: FormData): Observable<OrdenCarga> {
    return this.http.put<OrdenCarga>(`${this.url}/${id}`, formData);
  }

  delete(id: number): Observable<OrdenCarga> {
    return this.http.delete<OrdenCarga>(`${this.url}/${id}`);
  }

  aceptar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/aceptar`);
  }

  cancelar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/cancelar`);
  }

  conciliar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/conciliar`);
  }

  finalizar(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/finalizar`);
  }

  modificarAnticipos(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(
      `${this.url}/${id}/modify_advance_release`
    );
  }

  pdf(id: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf`);
  }

  resumenPdf(id: number): Observable<string> {
    return this.http.get<string>(`${this.url}/${id}/pdf/resumen`);
  }

  active(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/active`);
  }

  inactive(id: number): Observable<OrdenCarga> {
    return this.http.get<OrdenCarga>(`${this.url}/${id}/inactive`);
  }

  updateComentarios(id: number, comentarios: string): Observable<any> {
    return this.http.put(`${this.url}/${id}/comentarios`, { comentarios });
  }

  createComentarios(formData: FormData): Observable<OrdenCarga> {
    return this.http.post<OrdenCarga>(`${this.url}/comentarios`, formData);
  }

  getOCListById(id: number): Observable<OrdenCargaList> {
    return this.http.get<OrdenCargaList>(`${this.url}/oc-list/${id}`);
  }

  getListOCByCombinacionId(combinacionId: number): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/combinacion/${combinacionId}`);
  }

  getListOCByCombinacionIdAnOCAceptadas(combinacionId: number): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/combinacion/finalizar/aceptado/${combinacionId}`).pipe(
      catchError(this.handleError)
    );
  }

  getListOCByCombinacionIdAnOCFinalizadas(combinacionId: number): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/combinacion/finalizar/${combinacionId}`).pipe(
      catchError(this.handleError)
    );
  }

  getListOCByCombinacionIdAnOCNuevos(combinacionId: number): Observable<OrdenCargaList[]> {
    return this.http.get<OrdenCargaList[]>(`${this.url}/combinacion/crear/nuevo/aceptar/${combinacionId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    // Maneja el error de acuerdo a tu necesidad
    console.error('Error en la petición:', error);
    if (error.status === 404) {
      // Retorna un observable vacío o un error controlado si es 404
      return throwError(() => new Error('No se encontraron órdenes de carga aceptadas para esta combinación'));
    }
    return throwError(() => new Error('Error en el servidor'));
  }

}
