import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { SelectableItemTableComponent } from 'src/app/shared/selectable-item-table/selectable-item-table.component';
import { redirectToShowOCByMovimiento } from 'src/app/utils/movimiento-utils';

@Component({
  selector: 'app-selectable-movimiento-table',
  templateUrl: './selectable-movimiento-table.component.html',
  styleUrls: ['./selectable-movimiento-table.component.scss'],
})
export class SelectableMovimientoTableComponent {
  @Input() columns: Column[] = [
    {
      def: 'id',
      title: 'ID mov.',
      value: (element: Movimiento) => element.id,
      type: 'checkbox',
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
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => element.camion_placa,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
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
      def: 'numero_documento_relacionado',
      title: 'N° OC',
      value: (element: Movimiento) => element.numero_documento_relacionado,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'documento_fisico_oc',
      title: 'Doc. Físico',
      value: (element: Movimiento) =>
        ( element.tipo_movimiento_descripcion === 'Flete' ) ? (element.documento_fisico_oc) ? 'Sí' : 'No'  : '',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },

    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    /*
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
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },
    {
      def: 'ver',
      title: '',
      type: 'button',
      value: () => 'Ver OC',
      isHidden: (mov: Movimiento) =>
        mov.tipo_documento_relacionado_descripcion === 'OC',
      buttonCallback: (element: Movimiento) =>
        redirectToShowOCByMovimiento(this.router, element),
      stickyEnd: true,
    },*/
  ];

  @Input() list: Movimiento[] = [];

  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  @ViewChild(SelectableItemTableComponent)
  component?: SelectableItemTableComponent<Movimiento>;

  constructor(private router: Router) {}

  movimientoSelect($event:any):void {
    // TODO: iterar y ver para filtrar los movimientos
    this.selectedMovimientosChange.emit($event)
  }

  clearSelectValues():void {
    this.component!.clearCheckedValues();
  }

}
