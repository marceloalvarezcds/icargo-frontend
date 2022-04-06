import { Component, Input } from '@angular/core';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';

@Component({
  selector: 'app-liquidacion-instrumentos',
  templateUrl: './liquidacion-instrumentos.component.html',
  styleUrls: ['./liquidacion-instrumentos.component.scss'],
})
export class LiquidacionInstrumentosComponent {
  a = a;
  m = m;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: Instrumento) => element.id,
      sticky: true,
    },
    {
      def: 'via_descripcion',
      title: 'Vía',
      value: (element: Instrumento) => element.via_descripcion,
    },
    {
      def: 'cuenta_descripcion',
      title: 'Caja/Banco',
      value: (element: Instrumento) => element.cuenta_descripcion,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      value: (element: Instrumento) => element.fecha_instrumento,
      type: 'date',
    },
    {
      def: 'tipo_instrumento_descripcion',
      title: 'Tipo de instrumento',
      value: (element: Instrumento) => element.tipo_instrumento_descripcion,
    },
    {
      def: 'operacion_estado',
      title: 'Estado',
      value: (element: Instrumento) => element.operacion_estado,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Instrumento) => element.monto,
      type: 'number',
    },
    {
      def: 'provision_rechazada',
      title: 'Monto rechazado',
      value: (element: Instrumento) => element.provision_rechazada,
      type: 'number',
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'cheque_es_diferido',
      title: 'Es cheque diferido',
      value: (element: Instrumento) =>
        element.cheque_es_diferido ? 'Si' : 'No',
    },
    {
      def: 'cheque_fecha_vencimiento',
      title: 'Fecha de vencimiento del cheque',
      value: (element: Instrumento) => element.cheque_fecha_vencimiento,
      type: 'date',
    },
  ];

  @Input() list: Instrumento[] = [];
}
