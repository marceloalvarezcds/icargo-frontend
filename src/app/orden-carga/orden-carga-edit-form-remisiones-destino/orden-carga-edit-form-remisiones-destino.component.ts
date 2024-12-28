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
import { ImageDialogComponent } from 'src/app/dialogs/image-dialog/image-dialog.component';

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
  @Input() isEditPedido = false;
  @Input() puedeConciliar = false;
  @Input() set list(l: OrdenCargaRemisionDestino[]) {
    this.setList(l);
  }

  @Output() ocChange = new EventEmitter<void>();
  @Output() buttonAnticipoClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaRemisionDestinoService: OrdenCargaRemisionDestinoService
  ) {}

  create(): void {
    create(this.getDialogRef(), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
  }

  edit({ row }: TableEvent<OrdenCargaRemisionDestino>): void {
    edit(this.getDialogRef(row), this.emitOcChange.bind(this));
    this.buttonAnticipoClicked.emit();
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

    return this.dialog.open(OcRemisionDestinoFormDialogComponent, {
      width: '650px',
      height: 'auto',
      data
    });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }

  private setList(list: OrdenCargaRemisionDestino[]): void {
    this.lista = list ? list.slice() : [];
    this.configColumns();
  }

  private configColumns(): void {
    this.columns = [
      {
        def: 'descarga',
        title: 'Lugar de Descarga',
        value: (element: OrdenCargaRemisionDestino) =>
          element.lugar_descarga,
      },
      {
        def: 'id',
        title: 'Nº Descarga',
        value: (element: OrdenCargaRemisionDestino) => element.id,
      },

      {
        def: 'numero_documento',
        title: 'Nº Remito',
        footerDef: () => 'Total',
        value: (element: OrdenCargaRemisionDestino) => element.numero_documento,
      },
      // {
      //   def: 'numero_documento_origen',
      //   title: 'Nº de Documento origen',
      //   value: (element: OrdenCargaRemisionDestino) =>
      //     element.numero_documento_origen,
      // },

      {
        def: 'fecha',
        title: 'Fecha',
        value: (element: OrdenCargaRemisionDestino) => element.fecha,
        type: 'only-date',
      },
      {
        def: 'cantidad',
        title: 'Cant.',
        footerDef: () => this.totalCantidad,
        value: (element: OrdenCargaRemisionDestino) => element.cantidad,
        type: 'number',
      },
      {
        def: 'unidad_descripcion',
        title: 'Un.',
        value: (element: OrdenCargaRemisionDestino) =>
          element.unidad_descripcion,
      },
      {
        def: 'pdf',
        title: 'Imagen',
        type: 'button',
        value: () => 'PDF',
        buttonCallback: (element: OrdenCargaRemisionDestino) => {
          if (element.foto_documento) {
            this.dialog.open(ImageDialogComponent, {
              data: { imageUrl: element.foto_documento },
              width: 'auto',
              height: 'auto',

            });

          } else {
            console.error('No se proporcionó un nombre de archivo válido.');
          }
        }
      },
      // {
      //   def: 'cantidad_equiv',
      //   title: 'Cantidad Equiv. (kg)',
      //   footerDef: () => this.totalCantidad,
      //   value: (element: OrdenCargaRemisionDestino) => element.cantidad,
      //   type: 'number',
      // },

      { def: 'actions', title: 'Acciones', stickyEnd: true },
    ];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  shouldShowButton(row: any): boolean {
    return !!row.foto_documento;
  }

}
