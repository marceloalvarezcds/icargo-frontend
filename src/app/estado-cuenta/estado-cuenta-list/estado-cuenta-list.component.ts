import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column, ColumnLink } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';
import { createMovimiento } from 'src/app/utils/movimiento-utils';

type Filter = {
  tipo_contraparte_descripcion?: string;
  contraparte?: string;
};

@Component({
  selector: 'app-estado-cuenta-list',
  templateUrl: './estado-cuenta-list.component.html',
  styleUrls: ['./estado-cuenta-list.component.scss'],
})
export class EstadoCuentaListComponent implements OnInit {
  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  columns: Column[] = [
    {
      def: 'ctacte1',
      title: ' ',
      value: () => 'Ver detalle Contraparte',
      type: 'button',
      buttonCallback: (element: EstadoCuenta) => this.redirectToCtaCteContraparte(element),
      buttonIconName: (element: EstadoCuenta) => 'account_circle',
    },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Contraparte',
      value: (element: EstadoCuenta) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'contraparte',
      title: 'Cuenta Correntista',
      value: (element: EstadoCuenta) => element.contraparte_pdv ?? element.contraparte,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Documento',
      value: (element: EstadoCuenta) => element.contraparte_numero_documento_pdv ?? element.contraparte_numero_documento,
      footerDef: () => 'TOTAL SALDO GENERAL',
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: EstadoCuenta) => element.pendiente,
      link: (element: EstadoCuenta) =>
        element.cantidad_pendiente > 0
          ? {
              url: [
                `/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.CREAR}`,
              ],
              queryParams: getQueryParams(
                element,
                LiquidacionEtapaEnum.PENDIENTE
              ),
            }
          : undefined,
      type: 'number',
      footerDef: () => this.totalPendiente,
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: EstadoCuenta) => element.confirmado,
      link: (element: EstadoCuenta) => ({
        url: [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`],
        queryParams: getQueryParams(element, LiquidacionEtapaEnum.EN_PROCESO),
      }),
      type: 'number',
      footerDef: () => this.totalConfirmado,
    },
    {
      def: 'finalizado',
      title: LiquidacionEtapaEnum.PAGOS,
      value: (element: EstadoCuenta) => element.finalizado,
      link: (element: EstadoCuenta) =>
        element.cantidad_finalizado > 0
          ? {
              url: [
                `/estado-cuenta/${m.ESTADO_CUENTA}/${m.MOVIMIENTO}/${a.LISTAR}`,
              ],
              queryParams: getQueryParams(
                element,
                LiquidacionEtapaEnum.FINALIZADO
              ),
            }
          : undefined,
      type: 'number',
      footerDef: () => this.totalFinalizado,
    },
    {
      def: 'saldo',
      title: LiquidacionEtapaEnum.SALDO,
      value: (element: EstadoCuenta) => element.saldo,
      type: 'number',
      footerDef: () => (this.totalPendiente+this.totalConfirmado+this.totalFinalizado),
    },
  ];

  isFiltered = false;
  list: EstadoCuenta[] = [];
  tipoContraparteFilterList: string[] = [];
  tipoContraparteFiltered: string[] = [];
  contraparteFilterList: string[] = [];
  contraparteFiltered: string[] = [];

  pendiente: number = 0;
  confirmado: number = 0;
  finalizado: number = 0;

  get isFilteredByTipoContraparte(): boolean {
    return (
      this.tipoContraparteFiltered.length !==
      this.tipoContraparteFilterList.length
    );
  }

  get isFilteredByProducto(): boolean {
    return (
      this.contraparteFiltered.length !== this.contraparteFilterList.length
    );
  }

  get totalPendiente(): number {
    return this.pendiente;
  }

  get totalConfirmado(): number {
    return this.confirmado;
  }

  get totalFinalizado(): number {
    return this.finalizado;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private estadoCuentaService: EstadoCuentaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  downloadFile(): void {
    this.estadoCuentaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: EstadoCuenta, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByTipoContraparte =
      filter.tipo_contraparte_descripcion
        ?.split('|')
        .some(
          (x) => obj.tipo_contraparte_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    const filterByContraparte =
      filter.contraparte
        ?.split('|')
        .some((x) => obj.contraparte.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByTipoContraparte && filterByContraparte;
  }

  calcularTotales(): void{

    this.list.forEach( (mov:EstadoCuenta) => {
      mov.saldo = mov.pendiente + mov.confirmado + mov.finalizado;
      this.pendiente = this.pendiente + mov.pendiente;
      this.confirmado = this.confirmado + mov.confirmado;
      this.finalizado = this.finalizado + mov.finalizado;
    })

  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.tipoContraparteFiltered = this.tipoContraparteCheckboxFilter.getFilteredList();
    this.contraparteFiltered = this.contraparteCheckboxFilter.getFilteredList();

    if (this.isFilteredByTipoContraparte) {
      filter.tipo_contraparte_descripcion = this.tipoContraparteFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.contraparte = this.contraparteFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(
      this.isFiltered ? JSON.stringify(filter) : '',
      !this.isFiltered
    );
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  create(): void {
    const data: MovimientoFormDialogData = {
      estado: MovimientoEstadoEnum.PENDIENTE,
      es_contraparte_editable: true,
    };
    createMovimiento(data, this.dialog, this.snackbar, () => {
      this.getList();
    });
  }

  private getList(): void {
    this.estadoCuentaService.getListByGestorCarga().subscribe((list) => {

      list.forEach( (mov:EstadoCuenta) => {
        mov.saldo = mov.pendiente + mov.confirmado + mov.finalizado;
        this.pendiente = this.pendiente + mov.pendiente;
        this.confirmado = this.confirmado + mov.confirmado;
        this.finalizado = this.finalizado + mov.finalizado;
      })

      this.list = list;

      this.tipoContraparteFilterList = getFilterList(
        list,
        (x) => x.tipo_contraparte_descripcion
      );

      this.contraparteFilterList = getFilterList(list, (x) => x.contraparte);

      this.resetFilterList();

    });
  }

  private filter(
    filter: string,
    isFilteredByGlobalSearch: boolean = true
  ): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.tipoContraparteFiltered = this.tipoContraparteFilterList.slice();
    this.contraparteFiltered = this.contraparteFilterList.slice();
  }

  private redirectToCtaCteContraparte(mov: EstadoCuenta): void {

    this.router.navigate(
      [`/estado-cuenta/estado_cuenta/list-detalle/${a.LISTAR}`],
      { queryParams:getQueryParams(mov) }
    );
  }

}
