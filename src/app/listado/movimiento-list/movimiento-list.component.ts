import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

import { saveAs } from 'file-saver';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { df } from 'src/app/utils/date';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  contraparte?: string;
  proveedor?: string;
  punto_venta?: string;
  fecha_liquidacion?: {
    start: string;
    end: string;
  };
  fecha_movimiento?: {
    start: string;
    end: string;
  };
  estado?: string;
  tipo_contraparte?: string;
};

@Component({
  selector: 'app-movimiento-list',
  templateUrl: './movimiento-list.component.html',
  styleUrls: ['./movimiento-list.component.scss'],
})
export class MovimientoListComponent implements OnInit {
  modelo = m.MOVIMIENTO;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID Liq.',
      value: (element: Movimiento) => element.id,
      sticky: true,
    },
    // {
    //   def: 'liquidacion_id',
    //   title: 'Nº de Liquiddación',
    //   value: (element: Movimiento) => element.liquidacion_id,
    // },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo de Contraparte',
      value: (element: Movimiento) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'numero_documento_relacionado',
      title: 'Documento',
      value: (element: Movimiento) => element.numero_documento_relacionado,
    },
    {
      def: 'liquidacion_fecha_creacion',
      title: 'Fecha de Aprobación',
      value: (element: Movimiento) => element.liquidacion_fecha_creacion,
      type: 'date',
    },
    {
      def: 'contraparte',
      title: 'Arpobado por',
      value: (element: Movimiento) => element.contraparte,
    },
    {
      def: 'estado',
      title: 'Estado Liq.',
      value: (element: Movimiento) => element.estado,
    },

    // {
    //   def: 'contraparte_numero_documento',
    //   title: 'Nº Doc. Contraparte',
    //   value: (element: Movimiento) => element.contraparte_numero_documento,
    // },
    {
      def: 'monto',
      title: 'Tot. Movimiento',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.concepto,
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: Movimiento) => element.proveedor_nombre,
    },
    {
      def: 'punto_venta',
      title: 'Punto de Venta',
      value: (element: Movimiento) => element.punto_venta_nombre,
    },
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
    },
    {
      def: 'tipo_documento_relacionado_descripcion',
      title: 'Tipo de Doc Relacionado',
      value: (element: Movimiento) =>
        element.tipo_documento_relacionado_descripcion,
    },
 
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_nombre,
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Tipo de Cambio',
      value: (element: Movimiento) => element.tipo_cambio_moneda,
      type: 'number',
    },
    {
      def: 'fecha_cambio_moneda',
      title: 'Fecha de cambio',
      value: (element: Movimiento) => element.fecha_cambio_moneda,
      type: 'date',
    },
    {
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Movimiento) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },
  ];

  isFiltered = false;
  list: Movimiento[] = [];
  contraparteControl = new FormControl('');
  contraparteFiltered = '';
  proveedorControl = new FormControl('');
  proveedorFiltered = '';
  puntoVentaControl = new FormControl('');
  puntoVentaFiltered = '';
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  tipoContraparteFilterList: string[] = [];
  tipoContraparteFiltered: string[] = [];
  fechaLiquidacionControl = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  fechaLiquidacionFiltered = '';
  fechaMovimientoControl = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });
  fechaMovimientoFiltered = '';

  get isFilteredByContraparte(): boolean {
    return this.contraparteFiltered !== '';
  }

  get isFilteredByProveedor(): boolean {
    return this.proveedorFiltered !== '';
  }

  get isFilteredByPuntoVenta(): boolean {
    return this.puntoVentaFiltered !== '';
  }

  get isFilteredByFechaLiquidacion(): boolean {
    return this.fechaLiquidacionFiltered !== '';
  }

  get isFilteredByFechaMovimiento(): boolean {
    return this.fechaMovimientoFiltered !== '';
  }

  get isFilteredByEstado(): boolean {
    return this.estadoFiltered.length !== this.estadoFilterList.length;
  }

  get isFilteredByTipoContraparte(): boolean {
    return (
      this.tipoContraparteFiltered.length !==
      this.tipoContraparteFilterList.length
    );
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private movimientoService: MovimientoService,
    private reportsService: ReportsService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  downloadFile(): void {
    this.movimientoService
      .generateReportsByGestorCarga()
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  filterPredicate(obj: Movimiento, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByContraparte = filter.contraparte
      ? new RegExp(filter.contraparte, 'gi').test(obj.contraparte)
      : true;
    const filterByProveedor =
      filter.proveedor && obj.proveedor_nombre
        ? new RegExp(filter.proveedor, 'gi').test(obj.proveedor_nombre)
        : obj.proveedor_nombre
        ? true
        : false;
    const filterByPuntoVenta =
      filter.punto_venta && obj.punto_venta_nombre
        ? new RegExp(filter.punto_venta, 'gi').test(obj.punto_venta_nombre)
        : obj.punto_venta_nombre
        ? true
        : false;
    const liquidacionStart = filter.fecha_liquidacion
      ? new Date(filter.fecha_liquidacion.start).getTime()
      : -1;
    const liquidacionEnd = filter.fecha_liquidacion
      ? new Date(filter.fecha_liquidacion.end).getTime()
      : -1;
    const liquidacionDate = obj.liquidacion_fecha_creacion
      ? new Date(obj.liquidacion_fecha_creacion).getTime()
      : -1;
    const filterByFechaLiquidacion =
      liquidacionStart < 0 && liquidacionDate > 0
        ? true
        : liquidacionStart <= liquidacionDate &&
          liquidacionDate <= liquidacionEnd;
    const movimientoStart = filter.fecha_movimiento
      ? new Date(filter.fecha_movimiento.start).getTime()
      : -1;
    const movimientoEnd = filter.fecha_movimiento
      ? new Date(filter.fecha_movimiento.end).getTime()
      : -1;
    const movimientoDate = obj.created_at
      ? new Date(obj.created_at).getTime()
      : -1;
    const filterByFechaMovimiento =
      movimientoStart < 0 && movimientoDate > 0
        ? true
        : movimientoStart <= movimientoDate && movimientoDate <= movimientoEnd;
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByProducto =
      filter.tipo_contraparte
        ?.split('|')
        .some(
          (x) => obj.tipo_contraparte_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return (
      filterByContraparte &&
      filterByProveedor &&
      filterByPuntoVenta &&
      filterByFechaLiquidacion &&
      filterByFechaMovimiento &&
      filterByEstado &&
      filterByProducto
    );
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.contraparteFiltered = this.contraparteControl.value;
    this.proveedorFiltered = this.proveedorControl.value;
    this.puntoVentaFiltered = this.puntoVentaControl.value;
    this.fechaLiquidacionFiltered = this.fechaLiquidacionControl.value.start
      ? `Liq: ${df(this.fechaLiquidacionControl.value.start)} - ${df(
          this.fechaLiquidacionControl.value.end
        )}`
      : '';
    this.fechaMovimientoFiltered =
      this.fechaMovimientoControl.value.start !== ''
        ? `Mov: ${df(this.fechaMovimientoControl.value.start)} - ${df(
            this.fechaMovimientoControl.value.end
          )}`
        : '';
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.tipoContraparteFiltered =
      this.tipoContraparteCheckboxFilter.getFilteredList();
    if (this.isFilteredByContraparte) {
      filter.contraparte = this.contraparteFiltered;
      this.isFiltered = true;
    }
    if (this.isFilteredByProveedor) {
      filter.proveedor = this.proveedorFiltered;
      this.isFiltered = true;
    }
    if (this.isFilteredByPuntoVenta) {
      filter.punto_venta = this.puntoVentaFiltered;
      this.isFiltered = true;
    }
    if (this.isFilteredByFechaLiquidacion) {
      filter.fecha_liquidacion = this.fechaLiquidacionControl.value;
      this.isFiltered = true;
    }
    if (this.isFilteredByFechaMovimiento) {
      filter.fecha_movimiento = this.fechaMovimientoControl.value;
      this.isFiltered = true;
    }
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipoContraparte) {
      filter.tipo_contraparte = this.tipoContraparteFiltered.join('|');
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

  private getList(): void {
    this.movimientoService.getListByGestorCarga().subscribe((list) => {
      this.list = list;
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.tipoContraparteFilterList = getFilterList(
        list,
        (x) => x.tipo_contraparte_descripcion
      );
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
    this.contraparteControl.setValue('');
    this.contraparteFiltered = '';
    this.proveedorControl.setValue('');
    this.proveedorFiltered = '';
    this.puntoVentaControl.setValue('');
    this.puntoVentaFiltered = '';
    this.fechaLiquidacionControl.setValue({ start: '', end: '' });
    this.fechaLiquidacionFiltered = '';
    this.fechaMovimientoControl.setValue({ start: '', end: '' });
    this.fechaMovimientoFiltered = '';
    this.estadoFiltered = this.estadoFilterList.slice();
    this.tipoContraparteFiltered = this.tipoContraparteFilterList.slice();
  }
}
