import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComplementoFormDialogComponent } from 'src/app/dialogs/complemento-form-dialog/complemento-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { TableEvent } from 'src/app/interfaces/table';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-complementos',
  templateUrl: './orden-carga-edit-form-complementos.component.html',
  styleUrls: ['./orden-carga-edit-form-complementos.component.scss']
})
export class OrdenCargaEditFormComplementosComponent {

  columns: Column[] = [
    { def: 'concepto_descripcion', title: 'Concepto', value: (element: OrdenCargaComplemento) => element.concepto_descripcion, sticky: true },
    { def: 'remitente_monto', title: 'A Cobrar', value: (element: OrdenCargaComplemento) => element.remitente_monto },
    { def: 'remitente_moneda_nombre', title: 'Moneda', value: (element: OrdenCargaComplemento) => element.remitente_moneda_nombre },
    { def: 'propietario_monto', title: 'A Pagar', value: (element: OrdenCargaComplemento) => element.propietario_monto },
    { def: 'propietario_moneda_nombre', title: 'Moneda', value: (element: OrdenCargaComplemento) => element.propietario_moneda_nombre },
    { def: 'anticipado', title: 'Anticipado', value: (element: OrdenCargaComplemento) => element.anticipado_descripcion },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: OrdenCargaComplemento[] = [];
  modelo = m.ORDEN_CARGA_COMPLEMENTO;

  @Input() gestorCargaId?: number;
  @Input() puedeModificar = false;
  @Input() set lista(l: OrdenCargaComplemento[]) {
    this.list = l.slice();
  }

  constructor(private dialog: MatDialog) { }

  create(): void {
    create(this.dialog.open(ComplementoFormDialogComponent), (complemento: OrdenCargaComplemento) => {
      this.list = this.list.concat([complemento]);
    });
  }

  edit({ row, index }: TableEvent<OrdenCargaComplemento>): void {
    edit(this.dialog.open(ComplementoFormDialogComponent, { data: row }), (complemento: OrdenCargaComplemento) => {
      this.list[index] = complemento;
      this.list = this.list.slice();
    });
  }

  remove({ row, index }: TableEvent<OrdenCargaComplemento>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar al complemento ${row.concepto_descripcion}?`, () => {
      this.list = this.list.filter((_, i) => i !== index);
    });
  }
}
