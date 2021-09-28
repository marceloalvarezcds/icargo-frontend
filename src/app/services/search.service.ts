import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchBehaviorSubject = new BehaviorSubject<string>('');

  search(search: string): void {
    this.searchBehaviorSubject.next(search);
  }

  getSearchText(): Observable<string> {
    return this.searchBehaviorSubject.asObservable();
  }
}
