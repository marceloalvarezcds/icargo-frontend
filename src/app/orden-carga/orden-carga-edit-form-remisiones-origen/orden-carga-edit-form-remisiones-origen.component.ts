import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComplementoFormDialogComponent } from 'src/app/dialogs/complemento-form-dialog/complemento-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { TableEvent } from 'src/app/interfaces/table';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-remisiones-origen',
  templateUrl: './orden-carga-edit-form-remisiones-origen.component.html',
  styleUrls: ['./orden-carga-edit-form-remisiones-origen.component.scss']
})
export class OrdenCargaEditFormRemisionesOrigenComponent {

  columns: Column[] = [
    { def: 'numero_documento', title: 'Nº de Documento', value: (element: OrdenCargaRemisionOrigen) => element.numero_documento, sticky: true },
    { def: 'fecha', title: 'Fecha de Carga', value: (element: OrdenCargaRemisionOrigen) => element.fecha },
    { def: 'cantidad', title: 'Cantidad origen', value: (element: OrdenCargaRemisionOrigen) => element.cantidad },
    { def: 'unidad_descripcion', title: 'Unidad origen', value: (element: OrdenCargaRemisionOrigen) => element.unidad_descripcion },
    { def: 'cantidad_equiv', title: 'Cantidad Equiv. (kg)', value: (element: OrdenCargaRemisionOrigen) => element.cantidad },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: OrdenCargaRemisionOrigen[] = [];
  modelo = m.ORDEN_CARGA_REMISION_DESTINO;

  @Input() gestorCargaId?: number;
  @Input() puedeModificar = false;
  @Input() set lista(l: OrdenCargaRemisionOrigen[]) {
    this.list = l.slice();
  }

  constructor(private dialog: MatDialog) { }

  create(): void {
    create(this.dialog.open(ComplementoFormDialogComponent), (complemento: OrdenCargaRemisionOrigen) => {
      this.list = this.list.concat([complemento]);
    });
  }

  edit({ row, index }: TableEvent<OrdenCargaRemisionOrigen>): void {
    edit(this.dialog.open(ComplementoFormDialogComponent, { data: row }), (complemento: OrdenCargaRemisionOrigen) => {
      this.list[index] = complemento;
      this.list = this.list.slice();
    });
  }

  remove({ row, index }: TableEvent<OrdenCargaRemisionOrigen>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar la remisión de origen Nº ${row.numero_documento}?`, () => {
      this.list = this.list.filter((_, i) => i !== index);
    });
  }

}
