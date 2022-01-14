import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ComplementoFormDialogComponent } from 'src/app/dialogs/complemento-form-dialog/complemento-form-dialog.component';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { filter } from 'rxjs/operators';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-anticipos',
  templateUrl: './orden-carga-edit-form-anticipos.component.html',
  styleUrls: ['./orden-carga-edit-form-anticipos.component.scss']
})
export class OrdenCargaEditFormAnticiposComponent {

  columns: Column[] = [
    { def: 'id', title: 'Nº', value: (element: OrdenCargaAnticipoRetirado) => element.id, sticky: true },
    { def: 'tipo_anticipo_descripcion', title: 'Tipo de Anticipo', value: (element: OrdenCargaAnticipoRetirado) => element.tipo_anticipo_descripcion },
    { def: 'proveedor_nombre', title: 'Proveedor', value: (element: OrdenCargaAnticipoRetirado) => element.proveedor_nombre },
    { def: 'punto_venta_pais_nombre', title: 'País', value: (element: OrdenCargaAnticipoRetirado) => element.punto_venta_pais_nombre },
    { def: 'monto_retirado', title: 'Monto retirado', value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado },
    { def: 'moneda_nombre', title: 'Moneda', value: (element: OrdenCargaAnticipoRetirado) => element.moneda_nombre },
    { def: 'monto_equiv', title: 'Monto Equiv.', value: (element: OrdenCargaAnticipoRetirado) => element.monto_retirado },
    { def: 'gestor_carga_moneda_nombre', title: 'Moneda Equiv.', value: (element: OrdenCargaAnticipoRetirado) => element.gestor_carga_moneda_nombre },
    { def: 'created_by', title: 'Usuario creación', value: (element: OrdenCargaAnticipoRetirado) => element.created_by },
    { def: 'created_at', title: 'Fecha creación', value: (element: OrdenCargaAnticipoRetirado) => element.created_at },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: OrdenCargaAnticipoRetirado[] = [];
  modelo = m.ORDEN_CARGA_ANTICIPO_RETIRADO;

  @Input() gestorCargaId?: number;
  @Input() puedeModificar = false;
  @Input() set lista(l: OrdenCargaAnticipoRetirado[]) {
    this.list = l.slice();
  }

  constructor(private dialog: MatDialog) { }

  create(): void {
    create(this.dialog.open(ComplementoFormDialogComponent), (complemento: OrdenCargaAnticipoRetirado) => {
      this.list = this.list.concat([complemento]);
    });
  }

  edit({ row, index }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    edit(this.dialog.open(ComplementoFormDialogComponent, { data: row }), (complemento: OrdenCargaAnticipoRetirado) => {
      this.list[index] = complemento;
      this.list = this.list.slice();
    });
  }

  remove({ row, index }: TableEvent<OrdenCargaAnticipoRetirado>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar al anticipo Nº ${row.id}?`, () => {
      this.list = this.list.filter((_, i) => i !== index);
    });
  }
}
