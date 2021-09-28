import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/interfaces/column';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  filteredColumns: Column[] = [];
  searchSubscription = this.searchService.getSearchText().subscribe((search) => this.filterData(search));

  @Input() set columns(list: Column[]) {
    this.allColumns = list.slice();
    this.displayedColumns = list.map(c => c.def);
    this.columnStickyList = list.filter(c => c.sticky);
    this.columnStickyEndList = list.filter(c => c.stickyEnd);
    this.columnsToShowList = list.filter(c => !(c.sticky || c.stickyEnd)).map(c => c.title);
    this.columnsToShowFilteredList = this.columnsToShowList.slice();
    this.filterColumns();
  };

  @Input() set data(values: any[] | null) {
    if (values) {
      this.dataSource.data = values.slice();
    }
  }

  @Input() set filterPredicate(predicate: (d: any, filter: string) => boolean) {
    this.dataSource.filterPredicate = predicate;
  }

  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  filterData(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.paginator!.firstPage();
  }
}
