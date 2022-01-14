import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComplementoFormDialogComponent } from 'src/app/dialogs/complemento-form-dialog/complemento-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { TableEvent } from 'src/app/interfaces/table';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-remisiones-destino',
  templateUrl: './orden-carga-edit-form-remisiones-destino.component.html',
  styleUrls: ['./orden-carga-edit-form-remisiones-destino.component.scss']
})
export class OrdenCargaEditFormRemisionesDestinoComponent {

  columns: Column[] = [
    { def: 'numero_documento', title: 'Nº de Documento', value: (element: OrdenCargaRemisionDestino) => element.numero_documento, sticky: true },
    { def: 'numero_documento_origen', title: 'Nº de Documento origen', value: (element: OrdenCargaRemisionDestino) => element.numero_documento_origen },
    { def: 'fecha', title: 'Fecha de Descarga', value: (element: OrdenCargaRemisionDestino) => element.fecha },
    { def: 'cantidad', title: 'Cantidad destino', value: (element: OrdenCargaRemisionDestino) => element.cantidad },
    { def: 'unidad_descripcion', title: 'Unidad destino', value: (element: OrdenCargaRemisionDestino) => element.unidad_descripcion },
    { def: 'cantidad_equiv', title: 'Cantidad Equiv. (kg)', value: (element: OrdenCargaRemisionDestino) => element.cantidad },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: OrdenCargaRemisionDestino[] = [];
  modelo = m.ORDEN_CARGA_REMISION_DESTINO;

  @Input() gestorCargaId?: number;
  @Input() puedeModificar = false;
  @Input() set lista(l: OrdenCargaRemisionDestino[]) {
    this.list = l.slice();
  }

  constructor(private dialog: MatDialog) { }

  create(): void {
    create(this.dialog.open(ComplementoFormDialogComponent), (complemento: OrdenCargaRemisionDestino) => {
      this.list = this.list.concat([complemento]);
    });
  }

  edit({ row, index }: TableEvent<OrdenCargaRemisionDestino>): void {
    edit(this.dialog.open(ComplementoFormDialogComponent, { data: row }), (complemento: OrdenCargaRemisionDestino) => {
      this.list[index] = complemento;
      this.list = this.list.slice();
    });
  }

  remove({ row, index }: TableEvent<OrdenCargaRemisionDestino>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar la remisión de destino Nº ${row.numero_documento}?`, () => {
      this.list = this.list.filter((_, i) => i !== index);
    });
  }
}
