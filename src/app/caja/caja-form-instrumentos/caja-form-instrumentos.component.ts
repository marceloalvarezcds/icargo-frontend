import { Component, Input } from '@angular/core';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';

@Component({
  selector: 'app-caja-form-instrumentos',
  templateUrl: './caja-form-instrumentos.component.html',
  styleUrls: ['./caja-form-instrumentos.component.scss'],
})
export class CajaFormInstrumentosComponent {
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
      def: 'tipo_operacion_descripcion',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'credito',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_confirmado',
      title: 'Saldo',
      value: (element: Instrumento) => element.saldo_confirmado,
      type: 'number',
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
  ];

  @Input() list: Instrumento[] = [];
}
