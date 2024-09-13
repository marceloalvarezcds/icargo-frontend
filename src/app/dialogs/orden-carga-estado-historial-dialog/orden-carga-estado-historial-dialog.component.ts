import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaEstadoHistorial } from 'src/app/interfaces/orden-carga-estado-historial';


@Component({
  selector: 'app-orden-carga-estado-historial-dialog',
  templateUrl: './orden-carga-estado-historial-dialog.component.html',
})
export class OrdenCargaEstadoHistorialDialogComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'estado',
      title: 'Estado',
      value: (element: OrdenCargaEstadoHistorial) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: OrdenCargaEstadoHistorial) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: OrdenCargaEstadoHistorial) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaEstadoHistorial) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaEstadoHistorial) => element.modified_at,
      type: 'date',
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

  constructor(
    public dialogRef: MatDialogRef<OrdenCargaEstadoHistorialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gestorCargaId = data.gestorCargaId;
    this.setList(data.lista || []);
  }

  close(): void {
    this.dialogRef.close();
  }


  

}
