import { Component, Input } from '@angular/core';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { MatDialog } from '@angular/material/dialog';
import { DescuentoFormDialogComponent } from 'src/app/dialogs/descuento-form-dialog/descuento-form-dialog.component';
import { TableEvent } from 'src/app/interfaces/table';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-descuentos',
  templateUrl: './orden-carga-edit-form-descuentos.component.html',
  styleUrls: ['./orden-carga-edit-form-descuentos.component.scss']
})
export class OrdenCargaEditFormDescuentosComponent {

  columns: Column[] = [
    { def: 'concepto_descripcion', title: 'Concepto', value: (element: OrdenCargaDescuento) => element.concepto_descripcion, sticky: true },
    { def: 'propietario_monto', title: 'A Cobrar', value: (element: OrdenCargaDescuento) => element.propietario_monto },
    { def: 'propietario_moneda_nombre', title: 'Moneda', value: (element: OrdenCargaDescuento) => element.propietario_moneda_nombre },
    { def: 'proveedor_monto', title: 'A Pagar', value: (element: OrdenCargaDescuento) => element.proveedor_monto },
    { def: 'proveedor_moneda_nombre', title: 'Moneda', value: (element: OrdenCargaDescuento) => element.proveedor_moneda_nombre },
    { def: 'anticipado', title: 'Anticipado', value: (element: OrdenCargaDescuento) => element.anticipado_descripcion },
    { def: 'proveedor_nombre', title: 'Proveedor', value: (element: OrdenCargaDescuento) => element.proveedor_nombre },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: OrdenCargaDescuento[] = [];
  modelo = m.ORDEN_CARGA_DESCUENTO;

  @Input() gestorCargaId?: number;
  @Input() puedeModificar = false;
  @Input() set lista(l: OrdenCargaDescuento[]) {
    this.list = l.slice();
  }

  constructor(private dialog: MatDialog) { }

  create(): void {
    create(this.dialog.open(DescuentoFormDialogComponent), (complemento: OrdenCargaDescuento) => {
      this.list = this.list.concat([complemento]);
    });
  }

  edit({ row, index }: TableEvent<OrdenCargaDescuento>): void {
    edit(this.dialog.open(DescuentoFormDialogComponent, { data: row }), (complemento: OrdenCargaDescuento) => {
      this.list[index] = complemento;
      this.list = this.list.slice();
    });
  }

  remove({ row, index }: TableEvent<OrdenCargaDescuento>): void {
    remove(this.dialog, `¿Está seguro que desea eliminar al descuento ${row.concepto_descripcion}?`, () => {
      this.list = this.list.filter((_, i) => i !== index);
    });
  }
}
