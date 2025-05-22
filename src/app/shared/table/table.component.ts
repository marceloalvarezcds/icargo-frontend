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
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SearchOptions } from 'src/app/interfaces/filter';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { CheckboxEvent, TableEvent } from 'src/app/interfaces/table';
import { SearchService } from 'src/app/services/search.service';
import { delay } from 'src/app/utils/observable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnDestroy {
  e = EstadoEnum;
  f = LiquidacionEstadoEnum;
  a = PermisoAccionEnum;
  le = LiquidacionEtapaEnum;
  allChecked: boolean = false;
  checkedList: boolean[] = [];
  allColumns: Column[] = [];
  columnStickyList: Column[] = [];
  columnStickyEndList: Column[] = [];
  columnsToShowList: string[] = [];
  columnsToShowFilteredList: string[] = [];
  displayedColumns: string[] = [];
  tableDataSource = new MatTableDataSource<T>();
  defaultFilterPredicate = this.tableDataSource.filterPredicate.bind(
    this.tableDataSource
  );
  filteredColumns: Column[] = [];
  searchSubscription = this.searchService
    .getSearchOptions()
    .pipe(delay(500))
    .subscribe((search) => this.filterData(search));

  @Input() grouped = false;
  @Input() set dataSource(source: MatTableDataSource<T>) {
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

  @Input() set data(values: T[]) {
    this.checkedList = values.map((_) => false);
    this.tableDataSource.data = values.slice();
  }

  @Input() mostrarBotonEliminar: boolean = true;
  @Input() isVisible: boolean = false;

  @Input() filterPredicate = this.defaultFilterPredicate.bind(
    this.tableDataSource
  );

  @Input() fnHideEditRowButton?: (r:any) => boolean;
  @Input() fnHideDeleteRowButton?: (r:any) => boolean;
  @Input() oc?: OrdenCarga;
  @Input() tableStyles: any = {};
  @Input() isGestion: boolean = false;
  @Input() columnWidths: { [key: string]: string; } | undefined;
  @Input() formArray = new FormArray([]);
  @Input() gestorCuentaId?: number;
  @Input() disableSort = false;
  @Input() hideDelete = false;
  @Input() hideEdit = false;
  @Input() hideShow = false;
  @Input() isShow = false;
  @Input() addShowButton = false;
  @Input() showBtnAnular = false;
  @Input() shouldShowAnularButton = false;
  @Input() shouldBeShowFooter = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() noCheckGestorCuentaId = false;
  @Input() showBtnMovimientos = false;
  @Input() hideAnular: boolean = false;
  @Input() modelo?: PermisoModeloEnum;
  @Input() set configurarColumnasVisibles(list: Column[] | undefined) {
    if (list) {
      this.displayedColumns = list.map((c) => c.def);
      this.columnsToShowFilteredList = list.map((c) => c.title);
    }
  };

  @Output() filterResult = new EventEmitter<T[]>();
  @Output() activeClick = new EventEmitter<TableEvent<T>>();
  @Output() inactiveClick = new EventEmitter<TableEvent<T>>();
  @Output() anularAnticipoClick = new EventEmitter<TableEvent<T>>();
  @Output() editClick = new EventEmitter<TableEvent<T>>();
  @Output() deleteClick = new EventEmitter<TableEvent<T>>();
  @Output() showClick = new EventEmitter<TableEvent<T>>();
  @Output() allCheckedChange = new EventEmitter<boolean>();
  @Output() checkboxChange = new EventEmitter<CheckboxEvent<T>>();
  // TODO: los botones nuevos debe pasarse por parametro
  @Output() showClickDos = new EventEmitter<TableEvent<T>>();

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

      this.tableDataSource.filteredData;
    }
    this.filterResult.emit(this.tableDataSource.filteredData);
  }

  isTitleSaldosColumn(columnDef: string): boolean {
    const gestionColumns = ['concepto_gestion', 'anticipo_gestion',
                  'complemento_gestion', 'disponible_gestion', 'retirado_gestion', 'saldo_gestion',
                'usuario_gestion', 'fecha_gestion', 'modi_gestion', 'fecha_mod_gestion'];
    return this.isGestion && gestionColumns.includes(columnDef);
  }

  isFirstThreeColumns(columnDef: string): boolean {
    const firstThreeColumns = ['id_gestion',  '%'];
    return firstThreeColumns.includes(columnDef);
  }

  hideButtonEdit(row:T):boolean{
    if (this.fnHideEditRowButton) return this.fnHideEditRowButton(row);
    return true;
  }

  hideButtonDelete(row:T):boolean{
    if (this.fnHideDeleteRowButton) return this.fnHideDeleteRowButton(row);
    return true;
  }


  isStickyColumn(column: any): boolean {
    return column.sticky;
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

  getColorForState(state: string): string {
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
      default:
        return '#000000'; // Color por defecto o para otros estados
    }
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

  getStilos(column:any, row:any) {
    if (column.dinamicStyles) {
      return column.dinamicStyles(row);
    }
    return '';
  }

  isGroup(index:number, item:any): boolean{
    return item.isGroup;
  }

}
