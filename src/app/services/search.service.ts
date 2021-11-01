import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultSearchOptions, SearchOptions } from '../interfaces/filter';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchBehaviorSubject = new BehaviorSubject<SearchOptions>(defaultSearchOptions);

  search(textToSearch: string, isFilteredByGlobalSearch: boolean = true): void {
    this.searchBehaviorSubject.next({ textToSearch, isFilteredByGlobalSearch });
  }

  getSearchOptions(): Observable<SearchOptions> {
    return this.searchBehaviorSubject.asObservable();
  }
}
