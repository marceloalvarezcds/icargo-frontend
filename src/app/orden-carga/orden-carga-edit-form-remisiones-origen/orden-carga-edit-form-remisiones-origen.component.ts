import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { TableEvent } from 'src/app/interfaces/table';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaRemisionOrigenService } from 'src/app/services/orden-carga-remision-origen.service';
import { OcRemisionOrigenFormDialogComponent } from 'src/app/dialogs/oc-remision-origen-form-dialog/oc-remision-origen-form-dialog.component';
import { OcRemisionOrigenDialogData } from 'src/app/interfaces/oc-remision-origen-dialog-data';
import { EstadoEnum } from 'src/app/enums/estado-enum';

@Component({
  selector: 'app-orden-carga-edit-form-remisiones-origen',
  templateUrl: './orden-carga-edit-form-remisiones-origen.component.html',
  styleUrls: ['./orden-carga-edit-form-remisiones-origen.component.scss'],
})
export class OrdenCargaEditFormRemisionesOrigenComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [];

  lista: OrdenCargaRemisionOrigen[] = [];
  modelo = m.ORDEN_CARGA_REMISION_ORIGEN;

  get isAceptado(): boolean {
    return this.oc?.estado === EstadoEnum.ACEPTADO;
  }

  get totalCantidad(): string {
    return this.oc?.cantidad_origen.toString() ?? '0';
  }

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() puedeConciliar = false;
  @Input() set list(l: OrdenCargaRemisionOrigen[]) {
    this.setList(l);
  }

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaRemisionOrigen>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaRemisionOrigen>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar a la remisión de origen ${row.numero_documento}?`,
      () => {
        this.ordenCargaRemisionOrigenService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  private getDialogRef(
    item?: OrdenCargaRemisionOrigen
  ): MatDialogRef<
    OcRemisionOrigenFormDialogComponent,
    OrdenCargaRemisionOrigen
  > {
    const data: OcRemisionOrigenDialogData = {
      orden_carga_id: this.oc!.id,
      item,
    };
    return this.dialog.open(OcRemisionOrigenFormDialogComponent, { data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }

  private setList(list: OrdenCargaRemisionOrigen[]): void {
    this.lista = list.slice();
    this.columns = [
      {
        def: 'id',
        title: 'Nº',
        value: (element: OrdenCargaRemisionOrigen) => element.id,
        sticky: true,
      },
      {
        def: 'numero_documento',
        title: 'Nº de Documento',
        footerDef: 'Total',
        value: (element: OrdenCargaRemisionOrigen) => element.numero_documento,
      },
      {
        def: 'fecha',
        title: 'Fecha de Carga',
        value: (element: OrdenCargaRemisionOrigen) => element.created_at,
      },
      {
        def: 'cantidad',
        title: 'Cantidad origen',
        footerDef: this.totalCantidad,
        value: (element: OrdenCargaRemisionOrigen) => element.cantidad,
        type: 'number',
      },
      {
        def: 'unidad_descripcion',
        title: 'Unidad origen',
        value: (element: OrdenCargaRemisionOrigen) =>
          element.unidad_descripcion,
      },
      {
        def: 'cantidad_equiv',
        title: 'Cantidad Equiv. (kg)',
        footerDef: this.totalCantidad,
        value: (element: OrdenCargaRemisionOrigen) => element.cantidad,
        type: 'number',
      },
      { def: 'actions', title: 'Acciones', stickyEnd: true },
    ];
  }
}
