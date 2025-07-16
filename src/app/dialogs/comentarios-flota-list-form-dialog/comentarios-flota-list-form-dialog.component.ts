import { Component, Inject, Input, OnInit } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComentariosFlotaList } from 'src/app/interfaces/comentarios-flota-dialog-data';
@Component({
  selector: 'app-comentarios-flota-list-form-dialog',
  templateUrl: './comentarios-flota-list-form-dialog.component.html',
  styleUrls: ['./comentarios-flota-list-form-dialog.component.scss']
})
export class ComentariosFlotaListFormDialogComponent {

  columns: Column[] = [
      {
        def: 'elemento',
        title: 'Elemento',
        value: (element: ComentariosFlotaList) =>
          element.comentable_type === 'camion' ? 'Tracto' : element.comentable_type,
      },
      {
        def: 'evento',
        title: 'Tipo Evento',
        value: (element: ComentariosFlotaList) => element.tipo_evento,
      },
      {
        def: 'comentario',
        title: 'Comentario',
        value: (element: ComentariosFlotaList) => element.comentario,
      },
      {
        def: 'created_by',
        title: 'Usuario creación',
        value: (element: ComentariosFlotaList) => element.created_by,
      },
      {
        def: 'created_at',
        title: 'Fecha creación',
        value: (element: ComentariosFlotaList) => element.created_at,
        type: 'date-time',
      },

      { def: 'actions', title: 'Acciones', stickyEnd: true },
    ];

  @Input() list: ComentariosFlotaList[] = [];
  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { list: any[] }
  ) {this.list = data.list;}

}
