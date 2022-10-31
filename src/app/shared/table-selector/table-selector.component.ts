import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Column } from 'src/app/interfaces/column';

@Component({
  selector: 'app-table-selector',
  templateUrl: './table-selector.component.html',
  styleUrls: ['./table-selector.component.scss'],
  exportAs: 'app-table-selector',
})
export class TableSelectorComponent<T> implements OnInit {
  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();
  filteredColumns: Column[] = [];
  searchControlSubscription?: Subscription;

  @Input() set columns(list: Column[]) {
    this.allColumns = list.slice();
    this.displayedColumns = list.map((c) => c.def);
    this.columnStickyList = list.filter((c) => c.sticky);
    this.columnStickyEndList = list.filter((c) => c.stickyEnd);
    this.columnsToShowList = list
      .filter((c) => !(c.sticky || c.stickyEnd))
      .map((c) => c.title);
    this.columnsToShowFilteredList = this.columnsToShowList.slice();
    this.filterColumns();
  }

  @Input() selectedRow?: T;

  @Input() set data(values: T[]) {
    this.dataSource.data = values.slice();
  }
  @Input() set searchControl(control: FormControl) {
    this.searchControlSubscription = control.valueChanges.subscribe(
      (search) => {
        this.filterData(search);
      }
    );
  }

  @Output() selectedChange = new EventEmitter<T>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null =
    null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterColumns() {
    this.filteredColumns = this.columnStickyList.concat(
      this.allColumns
        .filter((col) =>
          this.columnsToShowFilteredList.find((c) => c === col.title)
        )
        .concat(this.columnStickyEndList)
    );
    this.displayedColumns = this.filteredColumns.map((c) => c.def);
  }

  filterData(searchText: string): void {
    const textToSearch = searchText.trim().toLowerCase();
    this.dataSource.filter = textToSearch;
    if (textToSearch.length) {
      this.dataSource.paginator!.firstPage();
    }
  }
}
