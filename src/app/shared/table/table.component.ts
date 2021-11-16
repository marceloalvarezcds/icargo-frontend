import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SearchOptions } from 'src/app/interfaces/filter';
import { TableEvent } from 'src/app/interfaces/table';
import { SearchService } from 'src/app/services/search.service';
import { delay } from 'src/app/utils/observable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  a = PermisoAccionEnum;
  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  tableDataSource = new MatTableDataSource<any>();
  defaultFilterPredicate = this.tableDataSource.filterPredicate.bind(this.tableDataSource);
  filteredColumns: Column[] = [];
  searchSubscription = this.searchService.getSearchOptions()
    .pipe(delay(500))
    .subscribe((search) => this.filterData(search));

  @Input() set dataSource(source: MatTableDataSource<any>) {
    this.tableDataSource = source;
    this.tableDataSource.sort = this.sort;
  }

  @Input() set columns(list: Column[]) {
    this.allColumns = list.slice();
    this.displayedColumns = list.map(c => c.def);
    this.columnStickyList = list.filter(c => c.sticky);
    this.columnStickyEndList = list.filter(c => c.stickyEnd);
    this.columnsToShowList = list.filter(c => !(c.sticky || c.stickyEnd)).map(c => c.title);
    this.columnsToShowFilteredList = this.columnsToShowList.slice();
    this.filterColumns();
  };

  @Input() set data(values: any[]) {
    this.tableDataSource.data = values.slice();
  }

  @Input() filterPredicate = this.defaultFilterPredicate.bind(this.tableDataSource);
  @Input() formArray = new FormArray([]);
  @Input() hideShow = false;
  @Input() isShow = false;
  @Input() addShowButton = false;
  @Input() modelo?: PermisoModeloEnum;

  @Output() editClick = new EventEmitter<TableEvent<any>>();
  @Output() deleteClick = new EventEmitter<TableEvent<any>>();
  @Output() showClick = new EventEmitter<TableEvent<any>>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.tableDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  filterColumns() {
    this.filteredColumns = this.columnStickyList.concat(this.allColumns
      .filter(col => this.columnsToShowFilteredList.find(c => c === col.title))
      .concat(this.columnStickyEndList));
    this.displayedColumns = this.filteredColumns.map(c => c.def);
  }

  filterData(searchOptions: SearchOptions): void {
    if (searchOptions.isFilteredByGlobalSearch) {
      this.tableDataSource.filterPredicate = this.defaultFilterPredicate;
    } else {
      this.tableDataSource.filterPredicate = this.filterPredicate;
    }
    this.tableDataSource.filter = searchOptions.textToSearch.trim().toLowerCase();
    if (searchOptions.textToSearch.trim().length) {
      this.tableDataSource.paginator!.firstPage();
    }
  }
}
