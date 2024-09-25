import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaComentariosHistorial } from 'src/app/interfaces/orden_carga_comentarios_historial';


@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
})
export class CommentDialogComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaComentariosHistorial) => element.modified_by,
    },
    {
      def: 'comentario',
      title: 'Comentario',
      value: (element: OrdenCargaComentariosHistorial) => element.comentario,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaComentariosHistorial) => element.modified_at,
      type: 'date',
    },
  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }


  lista: OrdenCargaComentariosHistorial[] = [];
  modelo = m.ORDEN_CARGA;

  @Input() gestorCargaId?: number;
  @Input() set list(l: OrdenCargaComentariosHistorial[]) {
    this.setList(l);
  }

  private setList(list: OrdenCargaComentariosHistorial[]): void {
    this.lista = list.slice();
  }

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gestorCargaId = data.gestorCargaId;
    this.setList(data.lista || []);
  }

  close(): void {
    this.dialogRef.close();
  }

}
