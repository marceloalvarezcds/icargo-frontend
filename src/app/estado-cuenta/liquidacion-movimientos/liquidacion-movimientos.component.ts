import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';

@Component({
  selector: 'app-liquidacion-movimientos',
  templateUrl: './liquidacion-movimientos.component.html',
  styleUrls: ['./liquidacion-movimientos.component.scss'],
})
export class LiquidacionMovimientosComponent {

  columns: Column[] = [
    {
      def: 'id',
      title: 'ID mov.',
      value: (element: Movimiento) => element.id,
      //type: 'checkbox',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Movimiento) => element.estado,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'created_at',
      title: 'Fecha ',
      value: (element: Movimiento) => element.created_at,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
      type: 'only-date',
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.tipo_movimiento_descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'tipo',
      title: 'Detalle',
      value: (element: Movimiento) => ( // descuento_concepto complemento_concepto
          (element.tipo_movimiento_descripcion === 'Anticipo') ? element.anticipo?.concepto
            : (element.tipo_movimiento_descripcion === 'Descuento' ) ? element.descuento_concepto
            : (element.tipo_movimiento_descripcion === 'Complemento' ) ? element.complemento_concepto : element.tipo_movimiento_descripcion
        ),
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'orden_carga_id',
      title: 'N° OC',
      value: (element: Movimiento) => element.orden_carga_id,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'moneda_simbolo',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_simbolo,
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Cambio',
      value: (element: Movimiento) => element.tipo_cambio_moneda,
      type: 'number',
    },
    {
      def: 'monto_mon_local',
      title: 'Monto ML',
      value: (element: Movimiento) => element.monto_mon_local,
      type: 'number',
    },
    /*{
      def: 'punto_venta',
      title: 'Punto de Venta',
      value: (element: Movimiento) =>
        element.anticipo?.punto_venta_nombre ?? '',
    },
    {
      def: 'ver',
      title: '',
      type: 'button',
      value: () => 'Ver OC',
      isHidden: (mov: Movimiento) =>
        mov.tipo_documento_relacionado_descripcion === 'OC',
      buttonCallback: (element: Movimiento) => this.redirectToShowOC(element),
      stickyEnd: true,
    },*/
  ];

  subRowColumnsToDisplay: Column[] = [
    {
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => {
          let label = "";
          console.log("subRowColumnsToDisplay: ", element);
          label = element.camion_placa ?? '';
          label = label + ' | Doc. Fiscal: '
            + (( element.tipo_movimiento_descripcion === 'Flete' ) ? ((element.documento_fisico_oc) ? 'Sí' : 'No')  : '');
          return label;
        },
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
  ]

  @Input() list: Movimiento[] = [];
  @Input() set addLiquidacionIdColumn(val: boolean) {
    if (val) {
      this.columns = [this.columns[0]]
        .concat([
          {
            def: 'liquidacion_id',
            title: 'Nº de Liquidación',
            value: (element: Movimiento) => element.liquidacion_id,
          },
        ])
        .concat(this.columns.slice(1, this.columns.length));
    }
  }

  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  constructor(private router: Router) {}

  private redirectToShowOC(mov: Movimiento): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/orden-carga/${m.ORDEN_CARGA}/${a.VER}`,
        mov.numero_documento_relacionado,
      ])
    );
    window.open(url, '_blank');
  }
}
