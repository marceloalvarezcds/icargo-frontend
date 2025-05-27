import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OcComplementoFormDialogComponent } from 'src/app/dialogs/oc-complemento-form-dialog/oc-complemento-form-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
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
      type: 'date-time',
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
      type: 'date-time',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true }
  ];

  modelo = m.ORDEN_CARGA_COMPLEMENTO;

  lista: OrdenCargaComplemento[] = [];

  @Input() oc?: OrdenCarga;
  ocComplemento?: OrdenCargaComplemento
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() isEditPedido = false;
  @Input() puedeConciliar = false;
  @Input() set list( l:  OrdenCargaComplemento[] ){
    this.setList(l);
  }

  @Input() fleteId?: number;

  @Output() ocChange = new EventEmitter<void>();
  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaComplementoService: OrdenCargaComplementoService
  ) {
  }

  formatFecha(fecha: string | Date): string {
    const date = new Date(fecha);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  show({ row }: TableEvent<OrdenCargaComplemento>): void {
    const dialogRef = this.getDialogRef(row);
    const dialogConfig = {
      ...dialogRef.componentInstance.dialogConfig,
      disabled: true,
    };
    dialogRef.componentInstance.dialogConfig = dialogConfig;
    this.buttonAnticipoClicked.emit();
  }

  private setList(list: OrdenCargaComplemento[]):void {
    this.lista = list ? list.slice() : [];
    //this.configColumns();
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
      oc: this.oc,
      item,
    };
    return this.dialog.open(OcComplementoFormDialogComponent, {
      panelClass: 'half-dialog',
      data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }
}
