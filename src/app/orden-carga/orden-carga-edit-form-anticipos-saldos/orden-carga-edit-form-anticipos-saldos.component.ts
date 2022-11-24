import { Component, Input } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaAnticipoSaldo } from 'src/app/interfaces/orden-carga-anticipo-saldo';

@Component({
  selector: 'app-orden-carga-edit-form-anticipos-saldos',
  templateUrl: './orden-carga-edit-form-anticipos-saldos.component.html',
  styleUrls: ['./orden-carga-edit-form-anticipos-saldos.component.scss'],
})
export class OrdenCargaEditFormAnticiposSaldosComponent {
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: OrdenCargaAnticipoSaldo) => element.id,
      sticky: true,
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: OrdenCargaAnticipoSaldo) => element.concepto,
    },
    {
      def: 'porcentaje',
      title: '%',
      value: (element: OrdenCargaAnticipoSaldo) => element.porcentaje,
      type: 'number',
    },
    {
      def: 'total_anticipo',
      title: 'Anticipo liberado (PYG)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_anticipo,
      type: 'number',
    },
    {
      def: 'total_complemento',
      title: 'Total complemento (PYG)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_complemento,
      type: 'number',
    },
    {
      def: 'total_disponible',
      title: 'Total disponible (PYG)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_disponible,
      type: 'number',
    },
    {
      def: 'total_retirado',
      title: 'Total retirado (PYG)',
      value: (element: OrdenCargaAnticipoSaldo) => element.total_retirado,
      type: 'number',
    },
    {
      def: 'saldo',
      title: 'Saldo en Línea (PYG)',
      value: (element: OrdenCargaAnticipoSaldo) => element.saldo,
      type: 'number',
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaAnticipoSaldo) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaAnticipoSaldo) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaAnticipoSaldo) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaAnticipoSaldo) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  @Input() list: OrdenCargaAnticipoSaldo[] = [];
}
