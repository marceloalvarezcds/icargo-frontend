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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { CheckboxEvent, TableEvent } from 'src/app/interfaces/table';
import { TableService } from 'src/app/services/table.service';
import { delay } from 'src/app/utils/observable';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
})
export class TablePaginatorComponent implements OnInit, OnDestroy {
  dataSource = new MatTableDataSource<any>();
  pageOptions?: PageEvent;
  pageOptionsSubscription = this.tableService
    .getPageOptions()
    .pipe(delay(500))
    .subscribe((pageOptions) => {
      this.pageOptions = pageOptions;
    });

  @Input() expandible: boolean = false;
  @Input() expandibleRow: boolean = false;
  @Input() expandibleButton: boolean = false;
  @Input() grouped: boolean = false;
  @Input() columns: Column[] = [];
  @Input() subRowColumnsToDisplay: Column[] = [];
  @Input() data: any[] = [];
  @Input() filterPredicate = this.dataSource.filterPredicate.bind(
    this.dataSource
  );
  @Input() gestorCargaId?: number;
  @Input() formArray = new FormArray([]);
  @Input() disableSort = false;
  @Input() hideDelete = false;
  @Input() hideEdit = false;
  @Input() hideShow = false;
  @Input() showBtnMovimientos = false;
  @Input() shouldShowAnularButton = false;
  @Input() shouldShowForzarCierrerButton: boolean = false;
  @Input() isShow = false;
  @Input() addShowButton = false;
  @Input() noCheckGestorCuentaId = false;
  @Input() modelo?: PermisoModeloEnum;
  @Input() showBtnAmpliar = false;
  @Input() shouldShowActiveButton = false;
  @Input() shouldShowInactiveButton = false;
  @Input() shouldShowCancelarButton = false;
  @Input() shouldBeShowFooter = false;
  @Input() configurarColumnasVisibles?: Column[];
  @Input() fnHideEditRowButton?: (r:any) => boolean;
  @Input() fnHideDeleteRowButton?: (r:any) => boolean;
  @Input() fnHideAnularRowButton?: (r:any) => boolean;
  @Input() fnHideCierreRowButton?: (r:any) => boolean;

  @Output() filterResult = new EventEmitter<any[]>();
  @Output() activeClick = new EventEmitter<TableEvent<any>>();
  @Output() inactiveClick = new EventEmitter<TableEvent<any>>();
  @Output() editClick = new EventEmitter<TableEvent<any>>();
  @Output() deleteClick = new EventEmitter<TableEvent<any>>();
  @Output() showClick = new EventEmitter<TableEvent<any>>();
  @Output() allCheckedChange = new EventEmitter<boolean>();
  @Output() checkboxChange = new EventEmitter<CheckboxEvent<any>>();
  @Output() showClickDos = new EventEmitter<TableEvent<any>>();
  @Output() ampliarClick = new EventEmitter<TableEvent<any>>();
  @Output() cancelarClick = new EventEmitter<TableEvent<any>>();
  @Output() anularAnticipoClick = new EventEmitter<TableEvent<any>>();
  @Output() forzarCierreClick = new EventEmitter<TableEvent<any>>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | null = null;

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.pageOptionsSubscription.unsubscribe();
  }

  setPageOptions(event: PageEvent): void {
    this.tableService.setPageOptions(event);
  }

  getPageList(): number[] {
    const pageIndex = this.pageOptions?.pageIndex || 0;
    const pageCount = this.paginator?.getNumberOfPages() || 0;
    const pagesToShow = Math.min(pageCount, 5); // Mostrar hasta 5 páginas

    const pages: number[] = [];
    for (let i = pageIndex; i < pageIndex + pagesToShow; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNumber: number): void {

  }

}
