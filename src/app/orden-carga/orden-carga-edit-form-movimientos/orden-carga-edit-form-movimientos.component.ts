import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovimientoEditByFleteFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-flete-form-dialog/movimiento-edit-by-flete-form-dialog.component';
import { MovimientoEditByMermaFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-merma-form-dialog/movimiento-edit-by-merma-form-dialog.component';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MovimientoMermaEditFormDialogData } from 'src/app/interfaces/movimiento-merma-edit-form-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { edit } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-orden-carga-edit-form-movimientos',
  templateUrl: './orden-carga-edit-form-movimientos.component.html',
  styleUrls: ['./orden-carga-edit-form-movimientos.component.scss'],
})
export class OrdenCargaEditFormMovimientosComponent {
  a = PermisoAccionEnum;

  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: Movimiento) => element.contraparte,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Doc. Contraparte',
      value: (element: Movimiento) => element.contraparte_numero_documento,
    },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo de Contraparte',
      value: (element: Movimiento) => element.tipo_contraparte_descripcion,
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
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
    },
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
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
      def: 'estado',
      title: 'Estado',
      value: (element: Movimiento) => element.estado,
    },
    {
      def: 'liquidacion_id',
      title: 'Nº de Liquidación',
      value: (element: Movimiento) => element.liquidacion_id,
    },
    {
      def: 'fecha_pago_cobro',
      title: 'Fecha de Liquidación',
      value: (element: Movimiento) => element.fecha_pago_cobro,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Movimiento) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Movimiento) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Movimiento) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Movimiento) => element.modified_at,
      type: 'date',
    },
    {
      def: 'editar',
      title: '',
      type: 'button',
      value: (mov: Movimiento) => (mov.can_edit_oc ? 'Editar' : ''),
      buttonCallback: (mov: Movimiento) =>
        mov.can_edit_oc ? this.openDialog(mov) : () => {},
      buttonIconName: (mov: Movimiento) => (mov.can_edit_oc ? 'edit' : ''),
      stickyEnd: true,
    },
  ];

  modelo = m.MOVIMIENTO;

  @Input() gestorCargaId?: number;
  @Input() list: Movimiento[] = [];
  @Input() oc?: OrdenCarga
  @Output() ocChange = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {}

  openDialog(item: Movimiento): void {
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

  getFleteDialogRef(
    item: Movimiento,
    afectado: AfectadoEnum
  ): MatDialogRef<MovimientoEditByFleteFormDialogComponent> {
    const data: MovimientoFleteEditFormDialogData = {
      afectado,
      item,
    };
    return this.dialog.open(MovimientoEditByFleteFormDialogComponent, { data });
  }

  getMermaDialogRef(
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
    this.ocChange.emit();
  }
}
