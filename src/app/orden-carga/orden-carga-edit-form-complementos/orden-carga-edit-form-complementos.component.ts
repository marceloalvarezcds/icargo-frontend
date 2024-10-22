import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OcComplementoFormDialogComponent } from 'src/app/dialogs/oc-complemento-form-dialog/oc-complemento-form-dialog.component';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OcComplementoDialogData } from 'src/app/interfaces/oc-complemento-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { TableEvent } from 'src/app/interfaces/table';
import { OrdenCargaComplementoService } from 'src/app/services/orden-carga-complemento.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-complementos',
  templateUrl: './orden-carga-edit-form-complementos.component.html',
  styleUrls: ['./orden-carga-edit-form-complementos.component.scss'],
})
export class OrdenCargaEditFormComplementosComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: OrdenCargaComplemento) => element.id,
      sticky: true,
    },
    {
      def: 'concepto_descripcion',
      title: 'Concepto',
      value: (element: OrdenCargaComplemento) => element.concepto_descripcion,
    },
    {
      def: 'anticipado',
      title: 'Anticipado',
      value: (element: OrdenCargaComplemento) => element.anticipado_descripcion,
    },
    {
      def: 'propietario_monto',
      title: 'A Pagar',
      value: (element: OrdenCargaComplemento) => element.propietario_monto,
      type: 'number',
    },
    {
      def: 'propietario_moneda_nombre',
      title: 'Moneda de Pago',
      value: (element: OrdenCargaComplemento) =>
        element.propietario_moneda_nombre,
    },
    {
      def: 'remitente_monto',
      title: 'A Cobrar',
      value: (element: OrdenCargaComplemento) => element.remitente_monto,
      type: 'number',
    },
    {
      def: 'remitente_moneda_nombre',
      title: 'Moneda de Cobro',
      value: (element: OrdenCargaComplemento) =>
        element.remitente_moneda_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: OrdenCargaComplemento) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: OrdenCargaComplemento) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: OrdenCargaComplemento) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: OrdenCargaComplemento) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  modelo = m.ORDEN_CARGA_COMPLEMENTO;

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() isEditPedido = false;
  @Input() puedeConciliar = false;
  @Input() list: OrdenCargaComplemento[] = [];
  @Input() fleteId?: number;

  @Output() ocChange = new EventEmitter<void>();
  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaComplementoService: OrdenCargaComplementoService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  edit({ row }: TableEvent<OrdenCargaComplemento>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  remove({ row }: TableEvent<OrdenCargaComplemento>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar al complemento ${row.concepto_descripcion}?`,
      () => {
        this.ordenCargaComplementoService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  private getDialogRef(
    item?: OrdenCargaComplemento
  ): MatDialogRef<OcComplementoFormDialogComponent, OrdenCargaComplemento> {
    const data: OcComplementoDialogData = {
      orden_carga_id: this.oc!.id,
      item,
    };
    return this.dialog.open(OcComplementoFormDialogComponent, { 
      width: '500px',
      height: 'auto',
      data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }
}
