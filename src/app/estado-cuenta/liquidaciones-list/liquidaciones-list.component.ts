import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ComentarioConfirmDialogComponent } from 'src/app/dialogs/comentario-confirm-dialog/comentario-confirm-dialog.component';
import { LiquidacionFormDialogComponent } from 'src/app/dialogs/liquidacion-form-dialog/liquidacion-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { changeLiquidacionDataMonto, changeLiquidacionStatusData } from 'src/app/form-data/liquidacion';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { Column } from 'src/app/interfaces/column';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { CheckboxEvent, TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { TablePaginatorComponent } from 'src/app/shared/table-paginator/table-paginator.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  tipo_contraparte_descripcion?: string;
  contraparte?: string;
  estado?: string;
};

@Component({
  selector: 'app-liquidaciones-list',
  templateUrl: './liquidaciones-list.component.html',
  styleUrls: ['./liquidaciones-list.component.scss']
})
export class LiquidacionesListComponent implements OnInit, AfterViewInit {

  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID Liq',
      //type: 'checkbox',
      value: (element: Liquidacion) => element.id,
    },
    {
      def: 'contraparte',
      title: 'Cuenta Correntista',
      value: (element: Liquidacion) => element.contraparte,
    },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo Contraparte',
      value: (element: Liquidacion) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Documento',
      value: (element: Liquidacion) => element.contraparte_numero_documento,
    },
    {
      def: 'aprobado_at',
      title: 'Fecha Aprobacion',
      type: 'only-date',
      value: (element: Liquidacion) => element.aprobado_at,
    },
    {
      def: 'user_aprueba',
      title: 'Aprobado',
      value: (element: Liquidacion) => element.user_aprueba,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Liquidacion) => `${element.estado.toUpperCase()}`,
    },
    {
      def: 'modified_at',
      title: 'Fecha Cancelacion',
      type: 'only-date',
      value: (element: Liquidacion) => (element.estado === LiquidacionEstadoEnum.CANCELADO ? element.modified_at : ''),
    },
    {
      def: 'modified_by',
      title: 'Cancelado',
      value: (element: Liquidacion) => (element.estado === LiquidacionEstadoEnum.CANCELADO ? element.modified_by : ''),
    },
    {
      def: 'es_cobro',
      title: 'Cobro/Pago',
      value: (element: Liquidacion) => element.es_pago_cobro,
    },
    {
      def: 'movimientos_saldo',
      title: 'Total Liquidacion',
      type: 'number',
      value: (element: Liquidacion) => element.es_orden_pago ? element.pago_cobro : element.movimientos_saldo,
    },
    /*{
      def: 'pago_cobro',
      title: 'Monto Pago/Cobro',
      type: 'number',
      value: (element: Liquidacion) => element.pago_cobro,
    },*/
    {
      def: 'instrumentos_saldo',
      title: 'Tot. Instrumento',
      type: 'number',
      value: (element: Liquidacion) => (element.es_pago_cobro === 'COBRO') ? element.instrumentos_saldo : element.instrumentos_saldo*-1,
    },
    {
      def: 'saldo_cc',
      title: 'Saldo C.C.',
      type: 'number',
      //value: (element: Liquidacion) => subtract( Math.abs(element.movimientos_saldo), element.instrumentos_saldo),
      value: (element: Liquidacion) =>
        //element.movimientos_saldo + ((element.es_pago_cobro === 'COBRO') ? element.instrumentos_saldo : element.instrumentos_saldo*-1),
      element.saldo_cc ?? ( element.movimientos_saldo + ((element.es_pago_cobro === 'COBRO') ? element.instrumentos_saldo : element.instrumentos_saldo*-1) )
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ]
  columnasVisibles?: Column[];
  /*
  TODO: se inhabilita tempralmente los botones
  para proceso en lote
  buttons : ButtonList[] = [
    {
      color: 'warn',
      tooltip: 'Autorizar',
      clases: 'buttons',
      styles: '',
      icon: 'add_circle',
      label: 'AUTORIZAR',
      buttonCallback: ($event:any) => {
      }
    },
    {
      color: 'primary',
      tooltip: 'Rechazar',
      clases: 'buttons',
      styles: '',
      icon: 'add_circle',
      label: 'RECHAZAR',
      buttonCallback: ($event:any) => {
      }
    },
    {
      color: 'primary',
      tooltip: 'Cancelar',
      clases: 'buttons',
      styles: '',
      icon: 'add_circle',
      label: 'CANCELAR',
      iconClass: 'add_circle',
      buttonCallback: ($event:any) => {
      }
    }
  ]
  */

  isFiltered = false;
  list: Liquidacion[] = [];
  liquidacionSelected: Liquidacion[] = [];
  tipoContraparteFilterList: string[] = [];
  tipoContraparteFiltered: string[] = [];
  contraparteFilterList: string[] = [];
  contraparteFiltered: string[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];

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

  get isFilteredByEstado(): boolean {
    return (
      this.estadoFiltered.length !== this.estadoFilterList.length
    );
  }

  /*esFinalizado(liquidacion:Liquidacion): boolean {
    return ( liquidacion.etapa === LiquidacionEtapaEnum.FINALIZADO
          || liquidacion.estado === LiquidacionEstadoEnum.SALDO_ABIERTO
          || liquidacion.estado === LiquidacionEstadoEnum.SALDO_CERRADO);
  }*/

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private liquidacionService: LiquidacionService,
    private estadoCuentaService: EstadoCuentaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
    private dialogService: DialogService,
    //private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  ngAfterViewInit(): void {
    //this.titleService.setTitle('prueba');
    this.columnasVisibles= this.columns.filter( item=> item.def !=='saldo_cc').slice();
  }

  downloadFile(): void {
    /*this.estadoCuentaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });*/
  }

  filterPredicate(obj: Liquidacion, filterJson: string): boolean {
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

    const filterByEstado =
        filter.estado
          ?.split('|')
          .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByTipoContraparte && filterByContraparte && filterByEstado;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.tipoContraparteFiltered = this.tipoContraparteCheckboxFilter.getFilteredList();
    this.contraparteFiltered = this.contraparteCheckboxFilter.getFilteredList();
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();

    if (this.isFilteredByTipoContraparte) {
      filter.tipo_contraparte_descripcion = this.tipoContraparteFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.contraparte = this.contraparteFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(
      this.isFiltered ? JSON.stringify(filter) : '',
      !this.isFiltered
    );
  }

  onCheckboxChange(event: CheckboxEvent<Liquidacion>): void {
    const item = event.value.row;
    if (event.event.checked) {
      this.liquidacionSelected.push(item);
    } else {
      this.liquidacionSelected = this.liquidacionSelected.filter((m) => m.id !== item.id);
    }
  }

  redirectToEdit(event: TableEvent<Liquidacion>): void {

    const liquidacion = event.row;
    const contraparteId = event.row.chofer_id ??
        event.row.propietario_id ??
        event.row.proveedor_id ??
        event.row.remitente_id;

    const data = {
      contraparte: liquidacion.contraparte,
      contraparte_id: contraparteId,
      contraparte_numero_documento: liquidacion.contraparte_numero_documento,
      tipo_contraparte_id: liquidacion.tipo_contraparte_id,
      tipo_contraparte_descripcion: liquidacion.tipo_contraparte.descripcion,
      isEdit: true,
      isNew: false,
      liquidacionId: liquidacion.id,
      etapa: liquidacion.etapa,
      punto_venta_id: liquidacion.punto_venta_id,
      flujo: liquidacion.tipo_mov_liquidacion,
      saldo_anticipos_combustible: liquidacion.saldo_anticipos_combustible, 
    };

    this.dialog
      .open(LiquidacionFormDialogComponent, {
        data,
        panelClass: 'full-dialog',
      })
      .afterClosed()
      //.pipe(filter((confirmed) => !!confirmed))
      .subscribe(() => {
        this.getList();
      });

  }

  redirectToShow(event: TableEvent<Liquidacion>): void {
    const liquidacion = event.row;
    const contraparteId = event.row.chofer_id ??
        event.row.propietario_id ??
        event.row.proveedor_id ??
        event.row.remitente_id;

    const data = {
      contraparte: liquidacion.contraparte,
      contraparte_id: contraparteId,
      contraparte_numero_documento: liquidacion.contraparte_numero_documento,
      tipo_contraparte_id: liquidacion.tipo_contraparte_id,
      tipo_contraparte_descripcion: liquidacion.tipo_contraparte.descripcion,
      isEdit: false,
      isNew: false,
      liquidacionId: liquidacion.id,
      etapa: liquidacion.etapa,
      punto_venta_id: liquidacion.punto_venta_id,
      flujo: liquidacion.tipo_mov_liquidacion,
    };

    this.dialog
      .open(LiquidacionFormDialogComponent, {
        data,
        panelClass: 'full-dialog',
      })
      .afterClosed()
      //.pipe(filter((confirmed) => !!confirmed))
      .subscribe(() => {
        this.getList();
      });
  }

  cierreForzado(event: TableEvent<Liquidacion>): void {
    const liquidacion = event.row;
    const message = `Está seguro que desea Forzar el CIERRE la Liquidación Nº ${liquidacion.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: true,
        },
      }),
      (comentario: string) => {
        const form = {comentario:comentario};
        this.liquidacionService
          .cierreForzado(liquidacion.id, changeLiquidacionDataMonto(form))
          .subscribe(() => {
            this.snackbar.changeStatus();
            this.getList();
          });
      }
    );

  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.liquidacionService.getListAll().subscribe((list) => {

      this.list = list;
      this.tipoContraparteFilterList = getFilterList(list, (x) => x.tipo_contraparte_descripcion);
      this.contraparteFilterList = getFilterList(list, (x) => x.contraparte);
      this.estadoFilterList = getFilterList(list, (x) => x.estado);

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
    this.estadoFiltered = this.estadoFilterList.slice();
  }

  fnHideEdit(obj: Liquidacion): boolean {
    return !(obj.estado === LiquidacionEstadoEnum.FINALIZADO || obj.estado === LiquidacionEstadoEnum.SALDO_CERRADO)
  }

  fnHideDelete(obj: Liquidacion): boolean {
    return !(obj.estado === LiquidacionEstadoEnum.FINALIZADO || obj.estado === LiquidacionEstadoEnum.SALDO_CERRADO)
  }

  fnHideAnular = (row: Liquidacion): boolean => {
    return (row!.estado === LiquidacionEstadoEnum.ACEPTADO
            || row!.estado === LiquidacionEstadoEnum.SALDO_ABIERTO
            || row!.estado === LiquidacionEstadoEnum.SALDO_CERRADO);
  };

}
