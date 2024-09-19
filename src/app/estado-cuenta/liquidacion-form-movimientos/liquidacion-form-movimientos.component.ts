import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovimientoEditByFleteFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-flete-form-dialog/movimiento-edit-by-flete-form-dialog.component';
import { MovimientoEditByMermaFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-merma-form-dialog/movimiento-edit-by-merma-form-dialog.component';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoMermaEditFormDialogData } from 'src/app/interfaces/movimiento-merma-edit-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  deleteMovimiento,
  editMovimiento,
  redirectToShowOCByMovimiento,
} from 'src/app/utils/movimiento-utils';
import { edit } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-liquidacion-form-movimientos',
  templateUrl: './liquidacion-form-movimientos.component.html',
  styleUrls: ['./liquidacion-form-movimientos.component.scss'],
})
export class LiquidacionFormMovimientosComponent {
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: Movimiento) => element.id,
      type: 'checkbox',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
      sticky: true,
    },
    {
      def: 'created_at',
      title: 'Fecha ',
      value: (element: Movimiento) => element.created_at,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
      type: 'only-date',
    },
    {
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => element.camion_placa,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.tipo_movimiento_descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'tipo',
      title: 'Detalle',
      value: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Anticipo') ? element.anticipo?.concepto : element.tipo_movimiento_descripcion),
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'numero_documento_relacionado',
      title: 'N° OC',
      value: (element: Movimiento) => element.numero_documento_relacionado,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Movimiento) => element.estado,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    /*{
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_nombre,
    },
    {
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },
    /*{
      def: 'punto_venta',
      title: 'Punto de Venta',
      value: (element: Movimiento) =>
        element.anticipo?.punto_venta_nombre ?? '',
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Tipo de Cambio',
      value: (element: Movimiento) => element.tipo_cambio_moneda,
      type: 'number',
    },
    {
      def: 'fecha_cambio_moneda',
      title: 'Fecha de cambio',
      value: (element: Movimiento) => element.fecha_cambio_moneda,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },
    */
    /*{
      def: 'oc',
      title: '',
      type: 'button',
      value: (mov: Movimiento) => (mov.es_editable ? '' : 'Ver OC'),
      buttonCallback: (mov: Movimiento) =>
        mov.es_editable
          ? () => {}
          : redirectToShowOCByMovimiento(this.router, mov),
      buttonIconName: (mov: Movimiento) =>
        mov.es_editable ? '' : 'visibility',
      stickyEnd: true,
    },
    {
      def: 'editar',
      title: '',
      type: 'button',
      value: (mov: Movimiento) =>
        mov.es_editable || mov.can_edit_oc ? 'Editar' : '',
      buttonCallback: (mov: Movimiento) =>
        mov.es_editable
          ? this.edit(mov)
          : mov.can_edit_oc
          ? this.editOC(mov)
          : () => {},
      buttonIconName: (mov: Movimiento) =>
        mov.es_editable || mov.can_edit_oc ? 'edit' : '',
      stickyEnd: true,
    },
    {
      def: 'eliminar',
      title: '',
      type: 'button',
      value: () => 'Eliminar',
      isDisable: (mov: Movimiento) => !mov.es_editable,
      buttonCallback: (mov: Movimiento) => this.delete(mov),
      buttonIconName: () => 'delete',
      stickyEnd: true,
    },*/
  ];

  @Input() list: Movimiento[] = [];

  @Output() movimientosInDBChange = new EventEmitter<Movimiento[]>();
  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  constructor(
    private movimientoService: MovimientoService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  private edit(item: Movimiento): void {
    const data: MovimientoFormDialogData = {
      item,
      estado: MovimientoEstadoEnum.PENDIENTE,
      es_contraparte_editable: false,
    };
    editMovimiento(data, this.dialog, this.snackbar, () => {
      this.movimientosInDBChange.emit();
    });
  }

  private delete(mov: Movimiento): void {
    deleteMovimiento(
      mov,
      this.dialog,
      this.movimientoService,
      this.snackbar,
      () => {
        this.movimientosInDBChange.emit();
      }
    );
  }

  private editOC(item: Movimiento): void {
    let afectado = item.es_propietario
      ? AfectadoEnum.PROPIETARIO
      : item.es_gestor
      ? AfectadoEnum.GESTOR
      : null;
    if (afectado) {
      if (item.es_flete) {
        edit(
          this.getFleteDialogRef(item, afectado),
          this.emitOcChange.bind(this)
        );
      } else if (item.es_merma) {
        edit(
          this.getMermaDialogRef(item, afectado),
          this.emitOcChange.bind(this)
        );
      }
    }
  }

  private getFleteDialogRef(
    item: Movimiento,
    afectado: AfectadoEnum
  ): MatDialogRef<MovimientoEditByFleteFormDialogComponent> {
    const data: MovimientoFleteEditFormDialogData = {
      afectado,
      item,
    };
    return this.dialog.open(MovimientoEditByFleteFormDialogComponent, { data });
  }

  private getMermaDialogRef(
    item: Movimiento,
    afectado: AfectadoEnum
  ): MatDialogRef<MovimientoEditByMermaFormDialogComponent> {
    const data: MovimientoMermaEditFormDialogData = {
      afectado,
      item,
    };
    return this.dialog.open(MovimientoEditByMermaFormDialogComponent, { data });
  }

  private emitOcChange(): void {
    this.movimientosInDBChange.emit();
  }
}
