import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { pageOptions } from '../interfaces/table';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private pageOptionsBehaviorSubject = new BehaviorSubject<PageEvent>(pageOptions);

  setPageOptions(pageOptions: PageEvent): void {
    this.pageOptionsBehaviorSubject.next(pageOptions);
  }

  getPageOptions(): Observable<PageEvent> {
    return this.pageOptionsBehaviorSubject.asObservable();
  }
}
