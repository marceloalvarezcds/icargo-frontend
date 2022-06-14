import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SearchOptions } from 'src/app/interfaces/filter';
import { CheckboxEvent, TableEvent } from 'src/app/interfaces/table';
import { SearchService } from 'src/app/services/search.service';
import { delay } from 'src/app/utils/observable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy {
  e = EstadoEnum;
  a = PermisoAccionEnum;
  allChecked: boolean = false;
  checkedList: boolean[] = [];
  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  tableDataSource = new MatTableDataSource<any>();
  defaultFilterPredicate = this.tableDataSource.filterPredicate.bind(
    this.tableDataSource
  );
  filteredColumns: Column[] = [];
  searchSubscription = this.searchService
    .getSearchOptions()
    .pipe(delay(500))
    .subscribe((search) => this.filterData(search));

  @Input() set dataSource(source: MatTableDataSource<any>) {
    this.tableDataSource = source;
    this.tableDataSource.sort = this.sort;
  }

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

  @Input() set data(values: any[]) {
    this.checkedList = values.map((_) => false);
    this.tableDataSource.data = values.slice();
  }

  @Input() filterPredicate = this.defaultFilterPredicate.bind(
    this.tableDataSource
  );
  @Input() formArray = new FormArray([]);
  @Input() gestorCuentaId?: number;
  @Input() disableSort = false;
  @Input() hideDelete = false;
  @Input() hideEdit = false;
  @Input() hideShow = false;
  @Input() isShow = false;
  @Input() addShowButton = false;
  @Input() shouldBeShowFooter = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() noCheckGestorCuentaId = false;
  @Input() modelo?: PermisoModeloEnum;

  @Output() activeClick = new EventEmitter<TableEvent<any>>();
  @Output() inactiveClick = new EventEmitter<TableEvent<any>>();
  @Output() editClick = new EventEmitter<TableEvent<any>>();
  @Output() deleteClick = new EventEmitter<TableEvent<any>>();
  @Output() showClick = new EventEmitter<TableEvent<any>>();
  @Output() allCheckedChange = new EventEmitter<boolean>();
  @Output() checkboxChange = new EventEmitter<CheckboxEvent<any>>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null =
    null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.tableDataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
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

  filterData(searchOptions: SearchOptions): void {
    if (searchOptions.isFilteredByGlobalSearch) {
      this.tableDataSource.filterPredicate = this.defaultFilterPredicate;
    } else {
      this.tableDataSource.filterPredicate = this.filterPredicate;
    }
    this.tableDataSource.filter = searchOptions.textToSearch
      .trim()
      .toLowerCase();
    if (
      searchOptions.textToSearch.trim().length &&
      this.tableDataSource.paginator
    ) {
      this.tableDataSource.paginator!.firstPage();
    }
  }

  onCheckboxChange(event: MatCheckboxChange, row: any, index: number): void {
    this.checkboxChange.emit({ event, value: { row, index } });
  }

  setAll(checked: boolean) {
    this.allChecked = checked;
    this.allCheckedChange.emit(checked);
    this.checkedList = this.checkedList.map((_) => checked);
  }

  someChecked(): boolean {
    return this.checkedList.filter((t) => t).length > 0 && !this.allChecked;
  }

  updateAllChecked() {
    this.allChecked = this.checkedList.every((t) => t);
  }
}
