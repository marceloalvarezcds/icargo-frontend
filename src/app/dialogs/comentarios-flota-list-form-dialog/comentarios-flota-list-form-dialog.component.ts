import { Component, Inject, Input, OnInit } from '@angular/core';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ComentariosFlotaList } from 'src/app/interfaces/comentarios-flota-dialog-data';
import { ComentarioFlotaService } from 'src/app/services/comentario-flota.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { FilePreviewDialogComponent } from '../file-preview-dialog/file-preview-dialog.component';
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
        def: 'archivo',
        title: 'Archivo',
        type: 'button',
        value: (element: ComentariosFlotaList) => element.archivo ? 'Ver archivo' : 'Archivo no adjuntado',
        buttonCallback: (element: ComentariosFlotaList) => {
          if (element.archivo) {
            this.dialog.open(FilePreviewDialogComponent, {
              data: {
                fileUrl: element.archivo,
                fileName: 'archivo'
              },
              width: '800px',
              height: '600px'
            });
          } else {
            console.error('No se encontró la URL del archivo');
          }
        }
      },
       {
        def: 'gestor',
        title: 'Gestor de Carga',
        value: (element: ComentariosFlotaList) => element.gestor_carga_nombre,
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
    private comentarioService: ComentarioFlotaService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { list: any[] }
  ) {this.list = data.list;}

downloadArchivo(filename: string): void {
  this.comentarioService.downloadFileByFilename(filename).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}


}
