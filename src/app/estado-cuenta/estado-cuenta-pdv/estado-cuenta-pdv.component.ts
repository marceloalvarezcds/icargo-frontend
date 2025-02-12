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
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getQueryParams, getQueryParamsPDV } from 'src/app/utils/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';
import { createMovimiento } from 'src/app/utils/movimiento-utils';

type Filter = {
  tipo_contraparte_descripcion?: string;
  contraparte?: string;
  linea?: string;
  proveedor?: string;
};

@Component({
  selector: 'app-estado-cuenta-pdv',
  templateUrl: './estado-cuenta-pdv.component.html',
  styleUrls: ['./estado-cuenta-pdv.component.scss']
})
export class EstadoCuentaPdvComponent implements OnInit {

  a = PermisoAccionEnum;
  m = PermisoModeloEnum;

  columns: Column[] = [
    {
      def: 'ctacte1',
      title: ' ',
      value: () => 'Ver detalle Contraparte',
      type: 'button',
      buttonCallback: (element: EstadoCuenta) => this.redirectToCtaCteContrapartePDV(element),
      buttonIconName: (element: EstadoCuenta) => 'account_circle',
      sticky: true
    },
    {
      def: 'contraparte_pdv',
      title: 'Cuenta Correntista',
      value: (element: EstadoCuenta) => element.contraparte_pdv,
      sticky: true
    },
    {
      def: 'contraparte',
      title: 'Proveedor',
      value: (element: EstadoCuenta) => element.contraparte,
    },
    {
      def: 'linea',
      title: 'Línea',
      value: (element: EstadoCuenta) => element.tipo_flujo,
      //sticky: true
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Doc.',
      value: (element: EstadoCuenta) => element.contraparte_numero_documento_pdv ?? element.contraparte_numero_documento,
      footerDef: () => 'TOTAL SALDO GENERAL',
      //sticky: true
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: EstadoCuenta) => element.confirmado,
      /*
      link: (element: EstadoCuenta) => ({
        url: [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.LISTAR}`],
        queryParams: getQueryParams(element, LiquidacionEtapaEnum.EN_PROCESO),
      }),
      */
      type: 'number',
      footerDef: () => this.totalConfirmado,
    },
    {
      def: 'finalizado',
      title: LiquidacionEtapaEnum.PAGOS,
      value: (element: EstadoCuenta) => element.finalizado,
      /*
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
      */
      type: 'number',
      footerDef: () => this.totalFinalizado,
    },
    {
      def: 'liquidacion_saldo',
      title: LiquidacionEtapaEnum.SALDO,
      value: (element: EstadoCuenta) => element.liquidacion_saldo,
      type: 'number',
      footerDef: () => (this.totalConfirmado+this.totalFinalizado),
    },
    {
      def: 'saldosentido',
      title: "D/H",
      value: (element: EstadoCuenta) => element.liquidacion_saldo >= 0 ? 'D' : 'H' ,
    },
    {
      def: 'provision',
      title: LiquidacionEtapaEnum.PROVISION,
      value: (element: EstadoCuenta) => element.provision,
      type: 'number',
      footerDef: () => this.totalProvision,
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: EstadoCuenta) => element.pendiente,
      /*
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
      */
      type: 'number',
      footerDef: () => this.totalPendiente,
    },
    {
      def: 'total_cc',
      title: 'Total CC',
      value: (element: EstadoCuenta) => element.total_cc,
      type: 'number',
      footerDef: () => (this.pendiente + this.totalConfirmado + this.totalFinalizado),
    },
    {
      def: 'total_sentido',
      title: "D/H",
      value: (element: EstadoCuenta) => element.total_cc >= 0 ? 'D' : 'H' ,
    },
  ];

  isFiltered = false;
  list: EstadoCuenta[] = [];
  contraparteFilterList: string[] = [];
  contraparteFiltered: string[] = [];
  lineaFilterList: string[] = [];
  lineaFiltered: string[] = [];
  proveedorFilterList: string[] = [];
  proveedorFiltered: string[] = [];

  provision: number = 0;
  pendiente: number = 0;
  confirmado: number = 0;
  finalizado: number = 0;

  get isFilteredByContraparte(): boolean {
    return (
      this.contraparteFiltered.length !== this.contraparteFilterList.length
    );
  }

  get isFilteredByLinea(): boolean {
    return (
      this.lineaFiltered.length !== this.lineaFilterList.length
    );
  }

  get isFilteredByProveedor(): boolean {
    return (
      this.proveedorFiltered.length !== this.proveedorFilterList.length
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

  get totalProvision(): number {
    return this.provision;
  }

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;

  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;

  @ViewChild('lineaCheckboxFilter')
  lineaCheckboxFilter!: CheckboxFilterComponent;

  @ViewChild('proveedorCheckboxFilter')
  proveedorCheckboxFilter!: CheckboxFilterComponent;

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

  /* OBS: en caso que el * se use como texto como parte de los campos, cambiar condicion de filtrado */
  filterPredicate(obj: EstadoCuenta, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);

    const filterByContraparte =
      filter.contraparte
        ?.split('*')
        .some((x) => obj.contraparte_pdv!.toLowerCase().indexOf(x) >= 0) ?? true;

    const filterByLinea =
      filter.linea
        ?.split('*')
        .some((x) => obj.tipo_flujo!.toLowerCase().indexOf(x) >= 0) ?? true;

    const filterByProveedor =
      filter.proveedor
        ?.split('*')
        .some((x) => obj.contraparte!.toLowerCase().indexOf(x) >= 0) ?? true;

    return filterByContraparte && filterByLinea && filterByProveedor;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;

    this.contraparteFiltered = this.contraparteCheckboxFilter.getFilteredList();
    this.lineaFiltered = this.lineaCheckboxFilter.getFilteredList();
    this.proveedorFiltered = this.proveedorCheckboxFilter.getFilteredList();

    if (this.isFilteredByContraparte) {
      //this.contraparteFiltered = this.contraparteFiltered.map( (ele:string)=> ele.split('|')[0]);
      filter.contraparte = this.contraparteFiltered.join('*').trim();
      this.isFiltered = true;
    }

    if (this.isFilteredByLinea) {
      filter.linea = this.lineaFiltered.join('*');
      this.isFiltered = true;
    }

    if (this.isFilteredByProveedor) {
      filter.proveedor = this.proveedorFiltered.join('*');
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
    this.estadoCuentaService.getListByPDV().subscribe((list) => {

      list.forEach( (mov:EstadoCuenta) => {
        mov.liquidacion_saldo = mov.confirmado + mov.finalizado;
        mov.total_cc = mov.pendiente +  mov.confirmado + mov.finalizado;

        this.pendiente = this.pendiente + mov.pendiente;
        this.confirmado = this.confirmado + mov.confirmado;
        this.finalizado = this.finalizado + mov.finalizado;
        this.provision = this.provision + mov.provision;
      })

      this.list = list;

      this.contraparteFilterList = getFilterList(list, (x) => x.contraparte_pdv!);
      this.lineaFilterList = getFilterList(list, (x) => x.tipo_flujo!);
      this.proveedorFilterList = getFilterList(list, (x) => x.contraparte!);

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
    this.contraparteFiltered = this.contraparteFilterList.slice();
    this.lineaFiltered = this.lineaFilterList.slice();
    this.proveedorFiltered = this.proveedorFilterList.slice();
  }

  private redirectToCtaCteContrapartePDV(mov: EstadoCuenta): void {
    this.router.navigate(
      [`/estado-cuenta/punto_venta/detallado/listar`],
      { queryParams:getQueryParamsPDV(mov) }
    );
  }

}
