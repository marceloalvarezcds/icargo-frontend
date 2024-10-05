import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionFormDialogComponent } from 'src/app/dialogs/liquidacion-form-dialog/liquidacion-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { Column } from 'src/app/interfaces/column';
import { ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { CheckboxEvent, TableEvent } from 'src/app/interfaces/table';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';
import { subtract } from 'src/app/utils/math';

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
export class LiquidacionesListComponent implements OnInit {
  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID Liq',
      type: 'checkbox',
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
      def: 'es_cobro',
      title: 'Cobro/Pago',
      value: (element: Liquidacion) => element.es_pago_cobro,
    },
    {
      def: 'movimientos_saldo',
      title: 'Tot. Movimiento',
      type: 'number',
      value: (element: Liquidacion) => element.movimientos_saldo,
    },
    {
      def: 'pago_cobro',
      title: 'Pago/Cobro',
      type: 'number',
      value: (element: Liquidacion) => element.pago_cobro,
    },
    {
      def: 'instrumentos_saldo',
      title: 'Tot. Instrumento',
      type: 'number',
      value: (element: Liquidacion) => (element.es_pago_cobro === 'COBRO') ? element.instrumentos_saldo : element.instrumentos_saldo*-1,
    },
    {
      def: 'saldo_residual',
      title: 'Saldo C.C.',
      type: 'number',
      //value: (element: Liquidacion) => subtract( Math.abs(element.movimientos_saldo), element.instrumentos_saldo),
      value: (element: Liquidacion) => 
        element.movimientos_saldo + ((element.es_pago_cobro === 'COBRO') ? element.instrumentos_saldo : element.instrumentos_saldo*-1),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ]

  buttons : ButtonList[] = [
    {
      color: 'warn',
      tooltip: 'Autorizar',
      clases: 'buttons',
      styles: '',
      icon: 'add',
      label: 'AUTORIZAR',
      iconClass: 'icon-add-style',
      buttonCallback: ($event:any) => {
        console.log('alerta desde button: ', $event);
      }
    },
    {
      color: 'primary',
      tooltip: 'Rechazar',
      clases: 'buttons',
      styles: '',
      icon: 'add',
      label: 'RECHAZAR',
      iconClass: 'icon-add-style',
      buttonCallback: ($event:any) => {
        console.log('alerta desde button: ', $event);
      }
    },
    {
      color: 'primary',
      tooltip: 'Cancelar',
      clases: 'buttons',
      styles: '',
      icon: 'add',
      label: 'CANCELAR',
      iconClass: 'icon-add-style',
      buttonCallback: ($event:any) => {
        console.log('alerta desde button: ', $event);
      }
    }
  ]

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

  esFinalizado(liquidacion:Liquidacion): boolean {
    return ( liquidacion.etapa === LiquidacionEtapaEnum.FINALIZADO
          || liquidacion.estado === LiquidacionEstadoEnum.SALDO_ABIERTO
          || liquidacion.estado === LiquidacionEstadoEnum.SALDO_CERRADO);
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private liquidacionService: LiquidacionService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
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

    console.log("this.liquidacionSelected: ", this.liquidacionSelected);
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
      liquidacionId: liquidacion.id,
      etapa: liquidacion.etapa,
      punto_venta_id: liquidacion.punto_venta_id
    };

    console.log("contraparte id: ", contraparteId);
    console.log("data: ", data);
    console.log("data: ", event.row);

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
    const contraparteId = event.row.chofer_id ??
        event.row.propietario_id ??
        event.row.proveedor_id ??
        event.row.remitente_id;

    const liquidacion = event.row;

    const data = {
      contraparte: event.row.contraparte,
      contraparte_id: contraparteId,
      contraparte_numero_documento: event.row.contraparte_numero_documento,
      tipo_contraparte_id: event.row.tipo_contraparte_id,
      tipo_contraparte_descripcion: event.row.tipo_contraparte.descripcion,
      isEdit: false,
      liquidacionId: event.row.id,
      etapa: event.row.etapa,
    };

    console.log("contraparte id: ", contraparteId);
    console.log("data: ", data);
    console.log("data: ", event.row);

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

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.liquidacionService.getListAll().subscribe((list) => {

      this.list = list;

      this.tipoContraparteFilterList = getFilterList(
        list, (x) => x.tipo_contraparte_descripcion);

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

}
