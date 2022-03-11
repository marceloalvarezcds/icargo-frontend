import { Component, Input } from '@angular/core';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';

@Component({
  selector: 'app-orden-carga-edit-form-movimientos',
  templateUrl: './orden-carga-edit-form-movimientos.component.html',
  styleUrls: ['./orden-carga-edit-form-movimientos.component.scss'],
})
export class OrdenCargaEditFormMovimientosComponent {
  a = PermisoAccionEnum;

  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: Movimiento) => element.contraparte,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Doc. Contraparte',
      value: (element: Movimiento) => element.contraparte_numero_documento,
    },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo de Contraparte',
      value: (element: Movimiento) => element.tipo_contraparte_descripcion,
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
      def: 'cuenta_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_descripcion,
    },
    // {
    //   def: 'tipo_documento_relacionado_descripcion',
    //   title: 'Tipo de Doc Relacionado',
    //   value: (element: Movimiento) =>
    //     element.tipo_documento_relacionado_descripcion,
    // },
    // {
    //   def: 'numero_documento_relacionado',
    //   title: 'Nº Doc Relacionado',
    //   value: (element: Movimiento) => element.numero_documento_relacionado,
    // },
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
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
      def: 'estado',
      title: 'Estado',
      value: (element: Movimiento) => element.estado,
    },
    {
      def: 'liquidacion_id',
      title: 'Nº de Liquidación',
      value: (element: Movimiento) => element.liquidacion_id,
    },
    {
      def: 'fecha_pago_cobro',
      title: 'Fecha de Liquidación',
      value: (element: Movimiento) => element.fecha_pago_cobro,
      type: 'date',
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

  modelo = m.MOVIMIENTO;

  @Input() gestorCargaId?: number;
  @Input() list: Movimiento[] = [];
}
