import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionResultado } from 'src/app/interfaces/orden-carga-remision-resultado';

@Component({
  selector: 'app-orden-carga-edit-form-remisiones-resultado',
  templateUrl: './orden-carga-edit-form-remisiones-resultado.component.html',
  styleUrls: ['./orden-carga-edit-form-remisiones-resultado.component.scss'],
})
export class OrdenCargaEditFormRemisionesResultadoComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'responsable',
      title: '',
      value: (element: OrdenCargaRemisionResultado) => element.responsable,
      sticky: true,
    },
    {
      def: 'tarifa_flete',
      title: 'Tarifa de Pedido',
      value: (element: OrdenCargaRemisionResultado) => element.tarifa_flete,
      type: 'number',
    },
    {
      def: 'total_flete',
      title: 'Total Pedido',
      value: (element: OrdenCargaRemisionResultado) => element.total_flete,
      type: 'number',
    },
    {
      def: 'merma_valor',
      title: 'Valor mercadería',
      value: (element: OrdenCargaRemisionResultado) => element.merma_valor,
      type: 'number',
    },
    {
      def: 'tolerancia',
      title: 'Tolerancia',
      value: (element: OrdenCargaRemisionResultado) => element.tolerancia,
      type: 'number',
    },
    {
      def: 'tolerancia_kg',
      title: 'Tolerancia (kg)',
      value: (element: OrdenCargaRemisionResultado) => element.tolerancia_kg,
      type: 'number',
    },
    {
      def: 'merma',
      title: 'Merma (kg)',
      value: (element: OrdenCargaRemisionResultado) => element.merma,
      type: 'number',
    },
    {
      def: 'merma_valor_total',
      title: 'Valor merma',
      value: (element: OrdenCargaRemisionResultado) =>
        element.merma_valor_total,
      type: 'number',
    },
    {
      def: 'merma_valor_total_moneda_local',
      title: 'Valor merma equiv. (Moneda Local)',
      value: (element: OrdenCargaRemisionResultado) =>
        element.merma_valor_total_moneda_local,
      type: 'number',
    },
    {
      def: 'total_complemento',
      title: 'Total complemento',
      value: (element: OrdenCargaRemisionResultado) =>
        element.total_complemento,
      type: 'number',
    },
    {
      def: 'total_descuento',
      title: 'Total descuento',
      value: (element: OrdenCargaRemisionResultado) => element.total_descuento,
      type: 'number',
    },
    {
      def: 'total_anticipo',
      title: 'Total anticipo',
      value: (element: OrdenCargaRemisionResultado) => element.total_anticipo,
      type: 'number',
    },
    {
      def: 'saldo',
      title: 'Saldo',
      value: (element: OrdenCargaRemisionResultado) => element.saldo,
      type: 'number',
      stickyEnd: true,
    },
  ];

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      responsable: [''],
      tarifa_flete: [''],
      total_flete: ['']
    });
  }


  lista: OrdenCargaRemisionResultado[] = [];
  modelo = m.ORDEN_CARGA_REMISION_RESULTADO;

  @Input() oc?: OrdenCarga
  @Input() title = 'Resultados';
  @Input() gestorCargaId?: number;
  @Input() set list(l: OrdenCargaRemisionResultado[]) {
    this.setList(l);
  }

  private setList(list: OrdenCargaRemisionResultado[]): void {
    this.lista = list.slice();
  }
}
