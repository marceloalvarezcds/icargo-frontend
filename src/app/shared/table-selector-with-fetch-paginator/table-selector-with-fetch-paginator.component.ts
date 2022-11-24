import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { Column } from 'src/app/interfaces/column';
import { PaginatedList, PaginatedListRequest } from 'src/app/interfaces/paginate-list';

@Component({
  selector: 'app-table-selector-with-fetch-paginator',
  templateUrl: './table-selector-with-fetch-paginator.component.html',
  styleUrls: ['./table-selector-with-fetch-paginator.component.scss']
})
export class TableSelectorWithFetchPaginatorComponent<T> implements OnInit {

  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();
  filteredColumns: Column[] = [];
  searchControlSubscription!: Observable<string>;
  searchTerm?: string;

  @Input() fetchFunction: ((request: PaginatedListRequest) => Observable<PaginatedList<T>>) = () => of();

  @Input() set columns(list: Column[]) {
    this.allColumns = list.slice();
    this.displayedColumns = list.map(c => c.def);
    this.columnStickyList = list.filter(c => c.sticky);
    this.columnStickyEndList = list.filter(c => c.stickyEnd);
    this.columnsToShowList = list.filter(c => !(c.sticky || c.stickyEnd)).map(c => c.title);
    this.columnsToShowFilteredList = this.columnsToShowList.slice();
    this.filterColumns();
  }

  @Input() selectedRow?: T;

  @Input() set searchControl(control: FormControl) {
    this.searchControlSubscription = control.valueChanges.pipe(debounceTime(500));
  }

  @Output() selectedChange = new EventEmitter<T>();

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit(): void {
    this.searchControlSubscription.subscribe(val => this.searchTerm = val);

    merge(this.paginator.page, this.searchControlSubscription)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.fetchFunction({
              page: this.paginator.pageIndex + 1,
              pageSize: this.paginator.pageSize || 10,
              query: this.searchTerm || ''
          }).pipe(catchError(() => of(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }

          this.paginator.length = data.totalRecords;
          return data.rows;
        }),
      )
      .subscribe(data => {
          this.dataSource.data = data;
      });
  }

  filterColumns() {
    this.filteredColumns = this.columnStickyList.concat(this.allColumns
      .filter(col => this.columnsToShowFilteredList.find(c => c === col.title))
      .concat(this.columnStickyEndList));
    this.displayedColumns = this.filteredColumns.map(c => c.def);
  }
}
