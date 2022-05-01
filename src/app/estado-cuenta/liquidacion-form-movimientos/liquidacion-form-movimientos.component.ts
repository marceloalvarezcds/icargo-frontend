import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  deleteMovimiento,
  editMovimiento,
  redirectToShowOCByMovimiento,
} from 'src/app/utils/movimiento-utils';

@Component({
  selector: 'app-liquidacion-form-movimientos',
  templateUrl: './liquidacion-form-movimientos.component.html',
  styleUrls: ['./liquidacion-form-movimientos.component.scss'],
})
export class LiquidacionFormMovimientosComponent {
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
      type: 'checkbox',
      sticky: true,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.concepto,
    },
    {
      def: 'cuenta_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_descripcion,
    },
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
    },
    {
      def: 'tipo_documento_relacionado_descripcion',
      title: 'Tipo de Doc Relacionado',
      value: (element: Movimiento) =>
        element.tipo_documento_relacionado_descripcion,
    },
    {
      def: 'numero_documento_relacionado',
      title: 'Nº Doc Relacionado',
      value: (element: Movimiento) => element.numero_documento_relacionado,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_nombre,
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
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Movimiento) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },
    {
      def: 'editar',
      title: '',
      type: 'button',
      value: (mov: Movimiento) => (mov.es_editable ? 'Editar' : 'Ver OC'),
      buttonCallback: (mov: Movimiento) =>
        mov.es_editable
          ? this.edit(mov)
          : redirectToShowOCByMovimiento(this.router, mov),
      buttonIconName: (mov: Movimiento) =>
        mov.es_editable ? 'edit' : 'visibility',
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
    },
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
}
