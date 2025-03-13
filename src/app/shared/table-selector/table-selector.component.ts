import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Column } from 'src/app/interfaces/column';

@Component({
  selector: 'app-table-selector',
  templateUrl: './table-selector.component.html',
  styleUrls: ['./table-selector.component.scss'],
  exportAs: 'app-table-selector',
})
export class TableSelectorComponent<T> implements OnInit, OnDestroy {

  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();
  filteredColumns: Column[] = [];
  searchControlSubscription?: Subscription;

  @Input() selectedRow?: T;
  @Input() fetchFunction?: (() => Observable<T[]>) = undefined;

  @Input() set columns(list: Column[]) {
    this.allColumns = list.slice();
    this.displayedColumns = list.map((c) => c.def);
    this.columnStickyList = list.filter((c) => c.sticky);
    this.columnStickyEndList = list.filter((c) => c.stickyEnd);
    this.columnsToShowList = list
      .filter((c) => !(c.sticky || c.stickyEnd))
      .map((c) => c.title);
    this.columnsToShowFilteredList = this.columnsToShowList.slice();
    this.dataSource.filterPredicate = this.defaultFilterPredicateFactory();
    this.filterColumns();
  }

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;
  @ViewChild(MatSort, { static: true }) sort: MatSort | null = null;

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.fetchFunction){
      this.fetchFunction().subscribe( data => {
        this.dataSource.data = data.slice();
      });
    }
  }

  ngOnDestroy(): void {
    this.searchControlSubscription?.unsubscribe();
  }

  defaultFilterPredicateFactory(): (data: T, filter: string) => boolean {
    const columns = this.displayedColumns.slice();
    return function defaultFilterPredicate(data: T, filter: string): boolean {
      const obj = data as any;
      const entries = Object.entries(obj).filter(
        ([key]) => columns.indexOf(key) >= 0
      );
      const valuesToFilter = entries.map(([_, value]) =>
        typeof value === 'object'
          ? JSON.stringify(value)
          : new String(value).toLowerCase()
      );
      return valuesToFilter.some((value) =>
        new RegExp(filter, 'gi').test(value)
      );
    };
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

  selectRow(row: any): void {
    if (this.deshabilitarOpcion(row.estado)) {
      alert('El elemento seleccionado está inactivo o en un estado no seleccionable.');
      return; // Detener la ejecución si no es seleccionable
    }

    this.selectedRow = row;
    this.selectedChange.emit(row);  // Emitir el evento de cambio si es necesario
  }

  private deshabilitarOpcion(estado: string): boolean {
    const estadosNoSeleccionables = ['Inactivo', 'Pendiente', 'Eliminado'];
    return estadosNoSeleccionables.includes(estado);
  }

  getColorForStateNew(column:any, row: any): string {
    if (column.def === 'estado'){
      const state = row[column.def];
      switch (state) {
        case 'Activo':
          return '#008000'; // Verde
        case 'Aceptado':
          return '#008000'; // Verde
        case 'Conciliado':
          return '#9747FF';
        case 'Finalizado':
          return '#89969F';
        case 'Inactivo':
          return '#FF0000'; // Rojo
        case 'Pendiente':
          return '#FFA500'; // Naranja
        case 'Provision':
          return 'gray'; // Naranja
        case 'Anulado':
          return 'red';
        case 'Saldo abierto':
          return '#9747FF';
        case 'Saldo cerrado':
          return '#89969F';
        case 'En Revisión':
          return '#008000'; // Verde
        case 'Pendiente':
          return '#FFA500'; // Naranja
        case 'Rechazado':
          return '#FF0000'; // Rojo
        default:
          return '#000000'; // Color por defecto o para otros estados
      }
    } else {
      if (column.dinamicStyles) {
        let stylos = column.dinamicStyles(row);
        return stylos.color ?? 'inherit';
      }
      return '';
    }

  }
}
