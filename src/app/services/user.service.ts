import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = `${environment.api}/user/`;

  constructor(private http: HttpClient) { }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(this.url);
  }
}
