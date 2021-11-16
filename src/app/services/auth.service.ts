import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { filter, map } from 'rxjs/operators';
import { Authentication } from '../interfaces/authentication';
import { TOKEN_KEY, USER_KEY } from '../contanst';

const authItem = localStorage.getItem(TOKEN_KEY) || 'null';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.api}/login/`;
  private authenticationSubject = new BehaviorSubject<Authentication | null>(JSON.parse(authItem));

  constructor(private router: Router, private http: HttpClient) { }

  get authenticationValue(): Authentication | null {
    const isEmpty = this.authenticationSubject.value ? !Object.keys(this.authenticationSubject.value).length : true;
    return isEmpty ? null : this.authenticationSubject.value;
  }

  get token(): Authentication | null {
    return this.authenticationValue;
  }

  get isAuthenticated(): boolean {
    return !!this.authenticationValue;
  }

  authObservable(): Observable<Authentication> {
    return this.authenticationSubject.pipe(filter(a => !!a)) as Observable<Authentication>;
  }

  login(formData: FormData): Observable<Authentication> {
    return this.http.post<Authentication>(this.url, formData)
      .pipe(map(auth => {
        localStorage.setItem(TOKEN_KEY, JSON.stringify(auth));
        this.authenticationSubject.next(auth);
        return auth;
      }));
  }

  logout(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.clear();
    this.authenticationSubject.next(null);
    this.router.navigate(['/login']);
  }
}
