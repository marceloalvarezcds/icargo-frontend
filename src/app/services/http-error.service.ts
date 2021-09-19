import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorService {
  private errorsBehaviorSubject = new BehaviorSubject<string[]>([]);

  setErrorList(errors: string[]): void {
    this.errorsBehaviorSubject.next(errors);
  }

  getHttpErrorListObservable(): Observable<string[]> {
    return this.errorsBehaviorSubject
      .asObservable()
      .pipe(filter((e) => e.length > 0));
  }
}
