import { Component, Input } from '@angular/core';
import { capitalize } from 'lodash';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  AuditDatabase,
  AuditDatabaseUpdateChanges,
} from 'src/app/interfaces/audit-database';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

const ACCIONES = {
  insert: 'Creado',
  update: 'Editado',
  delete: 'Eliminado',
};

const TABLAS = {
  orden_carga: 'Orden de Carga',
  orden_carga_anticipo_retirado: 'Anticipos',
  orden_carga_complemento: 'Complemento de OC',
  orden_carga_descuento: 'Descuento de OC',
  orden_carga_remision_destino: 'Remisiones de Origen',
  orden_carga_remision_origen: 'Remisiones de Destino',
};

const serializaValue = (value: any) =>
  typeof value === 'boolean'
    ? value
      ? 'Si'
      : 'No'
    : value?.length === 0
    ? '- '
    : value;

@Component({
  selector: 'app-orden-carga-edit-form-auditorias',
  templateUrl: './orden-carga-edit-form-auditorias.component.html',
  styleUrls: ['./orden-carga-edit-form-auditorias.component.scss'],
})
export class OrdenCargaEditFormAuditoriasComponent {
  columns: Column[] = [
    {
      def: 'row_id',
      title: 'Identificador',
      value: (element: AuditDatabase) => element.row_id,
      type: 'number',
    },
    {
      def: 'table_name',
      title: 'Elemento',
      value: (element: AuditDatabase) => (TABLAS as any)[element.table_name],
    },
    {
      def: 'action',
      title: 'Acción',
      value: (element: AuditDatabase) => (ACCIONES as any)[element.action],
    },
    {
      def: 'user',
      title: 'Usuario',
      value: (element: AuditDatabase) => element.user,
    },
    {
      def: 'date_hour',
      title: 'Fecha',
      value: (element: AuditDatabase) => element.date_hour,
      type: 'date',
    },
    {
      def: 'row',
      title: 'Datos',
      type: 'html',
      value: (element: AuditDatabase) => this.showChanges(element),
    },
  ];

  get isFinalizado(): boolean {
    return this.ordenCarga?.estado === EstadoEnum.FINALIZADO;
  }

  @Input() gestorCargaId?: number;
  @Input() list: AuditDatabase[] = [];
  @Input() ordenCarga?: OrdenCarga;

  private showChanges(data: AuditDatabase): string {
    const row = data.row;
    const keys = Object.keys(row).filter(
      (x) =>
        x !== 'id' &&
        x !== 'orden_carga_id' &&
        x !== 'flete_id' &&
        !/_by/.test(x) &&
        row[x] !== null
    );
    if (!keys.length) {
      return '';
    }
    let returned = '';
    if (data.action === 'update') {
      const changes: AuditDatabaseUpdateChanges = row;
      for (const key of keys) {
        returned += `<div><strong>${capitalize(
          key.replace(/_id/, '').replace('_', ' ')
        )}: </strong><span>Valor anterior: ${serializaValue(
          changes[key].old
        )}</span><span> Valor nuevo: ${serializaValue(
          changes[key].new
        )}</span></div>`;
      }
      return returned;
    }
    for (const key of keys) {
      returned += `<div><strong>${capitalize(
        key.replace(/_id/, '').replace('_', ' ')
      )}: </strong><span>${serializaValue(row[key])}</span></div>`;
    }
    return returned;
  }
}
