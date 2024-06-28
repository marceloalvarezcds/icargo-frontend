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
      def: 'id_caja',
      title: 'ID',
      value: (element: Instrumento) => element.id,
    },
    {
      def: 'numero_referencia_caja',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'usuario_caja',
      title: 'Usuario',
      value: (element: Instrumento) => element.created_by,
    },
    {
      def: 'fecha_instrumento_caja',
      title: 'Fecha',
      value: (element: Instrumento) => this.formatDate(element.fecha_instrumento),

    },
    {
      def: 'contraparte_caja',
      title: 'Contraparte',
      value: (element: Instrumento) => element.contraparte,
    },
    {
      def: 'tipo_contraparte',
      title: 'Tipo Contraparte',
      value: (element: Instrumento) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'id_liq_caja',
      title: 'ID liq.',
      value: (element: Instrumento) => element.liquidacion_id,
    },
    {
      def: 'tipo_operacion_descripcion_caja',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'credito_caja_instrumento',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito_caja_instrumento',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_caja',
      title: 'Saldo',
      value: (element: Instrumento) => element.saldo_confirmado,
      type: 'number',
    },

  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  @Input() list: Instrumento[] = [];
}

