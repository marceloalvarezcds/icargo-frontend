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
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
      type: 'checkbox',
      sticky: true,
    },
    {
      def: 'monto',
      title: 'Monto',
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
      def: 'numero_documento_relacionado',
      title: 'Nº Doc Relacionado',
      value: (element: Movimiento) => element.numero_documento_relacionado,
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
    },
  ];

  @Input() list: Movimiento[] = [];

  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  @ViewChild('app-selectable-movimiento-table')
  component?: SelectableItemTableComponent<Movimiento>;

  constructor(private router: Router) {}

  movimientoSelect($event:any):void {
    // TODO: iterar y ver para filtrar los movimientos

    this.selectedMovimientosChange.emit($event)
  }
}
