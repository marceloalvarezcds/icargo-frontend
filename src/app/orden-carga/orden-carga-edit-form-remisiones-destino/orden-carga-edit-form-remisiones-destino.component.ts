import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { TableEvent } from 'src/app/interfaces/table';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaRemisionDestinoService } from 'src/app/services/orden-carga-remision-destino.service';
import { OcRemisionDestinoDialogData } from 'src/app/interfaces/oc-remision-destino-dialog-data';
import { OcRemisionDestinoFormDialogComponent } from 'src/app/dialogs/oc-remision-destino-form-dialog/oc-remision-destino-form-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-orden-carga-edit-form-remisiones-destino',
  templateUrl: './orden-carga-edit-form-remisiones-destino.component.html',
  styleUrls: ['./orden-carga-edit-form-remisiones-destino.component.scss'],
})
export class OrdenCargaEditFormRemisionesDestinoComponent {
  a = PermisoAccionEnum;
  columns: Column[] = [];

  lista: OrdenCargaRemisionDestino[] = [];
  modelo = m.ORDEN_CARGA_REMISION_DESTINO;

  get cantidadDisponible(): number {
    return subtract(
      this.oc?.cantidad_origen ?? 0,
      this.oc?.cantidad_destino ?? 0
    );
  }

  get isAceptado(): boolean {
    return this.oc?.estado === EstadoEnum.ACEPTADO;
  }

  get totalCantidad(): number {
    return this.oc?.cantidad_destino ?? 0;
  }

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() puedeConciliar = false;
  @Input() set list(l: OrdenCargaRemisionDestino[]) {
    this.setList(l);
  }

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaRemisionDestinoService: OrdenCargaRemisionDestinoService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
  }

  edit({ row }: TableEvent<OrdenCargaRemisionDestino>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
  }

  remove({ row }: TableEvent<OrdenCargaRemisionDestino>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar a la remisión de destino ${row.numero_documento}?`,
      () => {
        this.ordenCargaRemisionDestinoService
          .delete(row.id)
          .subscribe(this.emitOcChange.bind(this));
      }
    );
  }

  private getDialogRef(
    item?: OrdenCargaRemisionDestino
  ): MatDialogRef<
    OcRemisionDestinoFormDialogComponent,
    OrdenCargaRemisionDestino
  > {
    const data: OcRemisionDestinoDialogData = {
      orden_carga_id: this.oc!.id,
      cantidad_disponible: this.cantidadDisponible + (item?.cantidad ?? 0),
      item,
    };
    return this.dialog.open(OcRemisionDestinoFormDialogComponent, { data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }

  private setList(list: OrdenCargaRemisionDestino[]): void {
    this.lista = list.slice();
    this.configColumns();
  }

  private configColumns(): void {
    this.columns = [
      {
        def: 'id',
        title: 'Nº',
        value: (element: OrdenCargaRemisionDestino) => element.id,
        sticky: true,
      },
      {
        def: 'numero_documento',
        title: 'Nº de Documento',
        footerDef: () => 'Total',
        value: (element: OrdenCargaRemisionDestino) => element.numero_documento,
      },
      {
        def: 'numero_documento_origen',
        title: 'Nº de Documento origen',
        value: (element: OrdenCargaRemisionDestino) =>
          element.numero_documento_origen,
      },
      {
        def: 'fecha',
        title: 'Fecha de Descarga',
        value: (element: OrdenCargaRemisionDestino) => element.fecha,
        type: 'date',
      },
      {
        def: 'cantidad',
        title: 'Cantidad destino',
        footerDef: () => this.totalCantidad,
        value: (element: OrdenCargaRemisionDestino) => element.cantidad,
        type: 'number',
      },
      {
        def: 'unidad_descripcion',
        title: 'Unidad destino',
        value: (element: OrdenCargaRemisionDestino) =>
          element.unidad_descripcion,
      },
      {
        def: 'cantidad_equiv',
        title: 'Cantidad Equiv. (kg)',
        footerDef: () => this.totalCantidad,
        value: (element: OrdenCargaRemisionDestino) => element.cantidad,
        type: 'number',
      },
      { def: 'actions', title: 'Acciones', stickyEnd: true },
    ];
  }
}
