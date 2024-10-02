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
import { subtract } from 'src/app/utils/math';
import * as saveAs from 'file-saver';
import { ReportsService } from 'src/app/services/reports.service';
import { ImageDialogComponent } from 'src/app/dialogs/image-dialog/image-dialog.component';

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

  get cantidadDisponible(): number {
    return subtract(
      this.oc?.cantidad_nominada ?? 0,
      this.oc?.cantidad_origen ?? 0
    );
  }

  get totalCantidad(): string {
    return this.oc?.cantidad_origen.toString() ?? '0';
  }

  @Input() oc?: OrdenCarga;
  @Input() gestorCargaId?: number;
  @Input() isShow = false;
  @Input() hideShow = false;
  @Input() puedeConciliar = false;
  @Input() set list(l: OrdenCargaRemisionOrigen[]) {
    this.setList(l);
  }

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService,
    private reportsService: ReportsService,
    
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
      cantidad_disponible: this.cantidadDisponible + (item?.cantidad ?? 0),
      item,
    };
    return this.dialog.open(OcRemisionOrigenFormDialogComponent, {     
      width: '650px',  // Ajusta según el contenido y diseño
      height: '400px', // Ajusta según el contenido y diseño
      data });
  }

  private emitOcChange(): void {
    this.ocChange.emit();
  }
  private setList(list: OrdenCargaRemisionOrigen[]): void {
    this.lista = list ? list.slice() : [];
    this.configColumns();
}


  private configColumns(): void {
    this.columns = [
      {
        def: 'lugar',
        title: 'Lugar de Carga',
        value: (element: OrdenCargaRemisionOrigen) => element.lugar_carga,
      
      },
      {
        def: 'numero_documento',
        title: 'Nº Remito',
        footerDef: () => 'Total',
        value: (element: OrdenCargaRemisionOrigen) => element.numero_documento,
      },
      {
        def: 'fecha',
        title: 'Fecha',
        value: (element: OrdenCargaRemisionOrigen) => this.formatDate(element.fecha),
      },
  
      {
        def: 'cantidad',
        title: 'Cant.',
        footerDef: () => this.totalCantidad,
        value: (element: OrdenCargaRemisionOrigen) => element.cantidad,
        type: 'number',
      },
      {
        def: 'unidad_descripcion',
        title: 'Un.',
        value: (element: OrdenCargaRemisionOrigen) =>
          element.unidad_descripcion,
      },

      {
        def: 'pdf',
        title: 'Imagen',
        type: 'button',
        value: () => 'PDF',
        buttonCallback: (element: OrdenCargaRemisionOrigen) => {
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
      //   value: (element: OrdenCargaRemisionOrigen) => element.cantidad,
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



}
