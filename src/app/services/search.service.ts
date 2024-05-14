import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { defaultSearchOptions, SearchOptions } from 'src/app/interfaces/filter';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchBehaviorSubject = new BehaviorSubject<SearchOptions>(
    defaultSearchOptions
  );

  constructor(private router: Router) {}

  search(textToSearch: string, isFilteredByGlobalSearch: boolean = true): void {
    const filterParts = textToSearch.split('.');
    this.searchBehaviorSubject.next({
      textToSearch,
      isFilteredByGlobalSearch,
      url: this.router.url,
    });
  }

  getSearchOptions(): Observable<SearchOptions> {
    const value = this.searchBehaviorSubject.value;
    if (!value.isFilteredByGlobalSearch && value.url !== this.router.url) {
      this.search('', false); // Si es otra ruta se reinicia el filtro
    }
    return this.searchBehaviorSubject.asObservable();
  }
}
