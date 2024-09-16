import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TableEvent } from 'src/app/interfaces/table';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { OcDescuentoDialogData } from 'src/app/interfaces/oc-descuento-dialog-data';
import { OcDescuentoFormDialogComponent } from 'src/app/dialogs/oc-descuento-form-dialog/oc-descuento-form-dialog.component';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaDescuentoService } from 'src/app/services/orden-carga-descuento.service';

@Component({
  selector: 'app-orden-carga-edit-form-descuentos',
  templateUrl: './orden-carga-edit-form-descuentos.component.html',
  styleUrls: ['./orden-carga-edit-form-descuentos.component.scss'],
})
export class OrdenCargaEditFormDescuentosComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: OrdenCargaDescuento) => element.id,
      sticky: true,
    },
    {
      def: 'concepto_descripcion',
      title: 'Concepto',
      value: (element: OrdenCargaDescuento) => element.concepto_descripcion,
    },
    {
      def: 'propietario_monto',
      title: 'A Cobrar',
      value: (element: OrdenCargaDescuento) => element.propietario_monto,
      type: 'number',
    },
    {
      def: 'propietario_moneda_nombre',
      title: 'Moneda de Cobro',
      value: (element: OrdenCargaDescuento) =>
        element.propietario_moneda_nombre,
    },
    {
      def: 'proveedor_monto',
      title: 'A Pagar',
      value: (element: OrdenCargaDescuento) => element.proveedor_monto,
      type: 'number',
    },
    {
      def: 'proveedor_moneda_nombre',
      title: 'Moneda de Pago',
      value: (element: OrdenCargaDescuento) => element.proveedor_moneda_nombre,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: OrdenCargaDescuento) => element.proveedor_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaDescuento) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaDescuento) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaDescuento) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaDescuento) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  modelo = m.ORDEN_CARGA_DESCUENTO;

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() puedeConciliar = false;
  @Input() list: OrdenCargaDescuento[] = [];

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaDescuentoService: OrdenCargaDescuentoService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaDescuento>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaDescuento>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar al descuento ${row.concepto_descripcion}?`,
      () => {
        this.ordenCargaDescuentoService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  private getDialogRef(
    item?: OrdenCargaDescuento
  ): MatDialogRef<OcDescuentoFormDialogComponent, OrdenCargaDescuento> {
    const data: OcDescuentoDialogData = {
      orden_carga_id: this.oc!.id,
      item,
    };
    return this.dialog.open(OcDescuentoFormDialogComponent, {  
      width: '500px',
      height: 'auto', data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }
}
