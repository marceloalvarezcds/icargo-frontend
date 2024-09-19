import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  url = `${environment.api}/reports`;

  constructor(private http: HttpClient) { }

  downloadFile(filename: string): Observable<Blob> {
    return this.http.get(`${this.url}/${filename}`, {
      responseType: 'blob'
    });
  }

  downloadImage(imageUrl: string): Observable<Blob> {
    return this.http.get(`${this.url}/${imageUrl}`, {
      responseType: 'blob'
    });
  }
}
