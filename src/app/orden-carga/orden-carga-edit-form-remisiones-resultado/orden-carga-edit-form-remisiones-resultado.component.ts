import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
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
      title: 'Resultados',
      value: (element: OrdenCargaRemisionResultado) => element.responsable,
      sticky: true,
    },
    {
      def: 'tarifa_flete',
      title: 'Tarifa Flete',
      value: (element: OrdenCargaRemisionResultado) =>
        `${element.tarifa_flete} ${this.getFleteUnidad(element)}`,
      type: 'text',
    },
    {
      def: 'total_flete_mon',
      title: 'Total Flete',
      value: (element: OrdenCargaRemisionResultado) => element.total_flete,
      type: 'number',
    },
    {
      def: 'tolerancia',
      title: 'Tarifa Merma',
      value: (element: OrdenCargaRemisionResultado) =>
        `${element.merma_valor} ${this.getFleteUnidad(element)}`,
      type: 'text',
    },
    {
      def: 'total_kg',
      title: 'Tolerancia',
      value: (element: OrdenCargaRemisionResultado) => element.tolerancia_kg,
      type: 'number',
    },
    {
      def: 'merma_valor',
      title: 'Merma',
      value: (element: OrdenCargaRemisionResultado) => element.merma,
      type: 'number',
    },

    {
      def: 'merma_valor_total_moneda_local',
      title: 'Total Merma',
      value: (element: OrdenCargaRemisionResultado) => element.merma_valor_total_moneda_local,
      type: 'number',
    },
    {
      def: 'comp_desc',
      title: 'Total Compl./Desc',
      value: (element: OrdenCargaRemisionResultado) => element.complemento_descuento,
      type: 'number',
    },
    {
      def: 'bruto',
      title: 'Total Bruto',
      value: (element: OrdenCargaRemisionResultado) => element.saldo_bruto,
      type: 'number',
    },
    {
      def: 'efectivo',
      title: 'Anticipo (Efectivo)',
      value: (element: OrdenCargaRemisionResultado) =>
        element.total_efectivo,
      type: 'number',
    },

    {
      def: 'combustible',
      title: 'Anticipo (Combustible)',
      value: (element: OrdenCargaRemisionResultado) =>
        element.total_combustible,
      type: 'number',
    },

    {
      def: 'saldo',
      title: 'Saldo Cobrar/Pagar',
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

  ordencarga?: OrdenCarga
  @Input() oc?: OrdenCarga
  @Input() title = 'Resultados';
  @Input() gestorCargaId?: number;
  @Input() set list(l: OrdenCargaRemisionResultado[]) {
    this.setList(l);
  }

  private setList(list: OrdenCargaRemisionResultado[]): void {
    this.lista = list.slice();
  }

  getFleteUnidad(element: OrdenCargaRemisionResultado): string {
    if (element.responsable === 'Gestor de Carga') {
      return this.oc?.flete_tarifa_unidad_gestor_carga || '';
    }
    if (element.responsable === 'Propietario') {
      return this.oc?.flete_tarifa_unidad || '';
    }
    return '';
  }

}
