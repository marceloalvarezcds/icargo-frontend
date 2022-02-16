import { Component, Input } from '@angular/core';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaEstadoHistorial } from 'src/app/interfaces/orden-carga-estado-historial';

@Component({
  selector: 'app-orden-carga-edit-form-estado-historial',
  templateUrl: './orden-carga-edit-form-estado-historial.component.html',
  styleUrls: ['./orden-carga-edit-form-estado-historial.component.scss'],
})
export class OrdenCargaEditFormEstadoHistorialComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: OrdenCargaEstadoHistorial) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: OrdenCargaEstadoHistorial) => element.created_by,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: OrdenCargaEstadoHistorial) => element.estado,
      type: 'number',
    },
  ];

  lista: OrdenCargaEstadoHistorial[] = [];
  modelo = m.ORDEN_CARGA;

  @Input() gestorCargaId?: number;
  @Input() set list(l: OrdenCargaEstadoHistorial[]) {
    this.setList(l);
  }

  private setList(list: OrdenCargaEstadoHistorial[]): void {
    this.lista = list.slice();
  }
}
