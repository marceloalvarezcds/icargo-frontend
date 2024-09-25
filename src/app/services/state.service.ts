import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private formSavedSubject = new Subject<void>();
  formSaved$ = this.formSavedSubject.asObservable();

  notifyFormSaved(): void {
    this.formSavedSubject.next();
  }
}
