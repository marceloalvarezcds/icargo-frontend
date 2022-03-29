import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MovimientosSelectedDialogComponent } from 'src/app/dialogs/movimientos-selected-dialog/movimientos-selected-dialog.component';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import {
  createLiquidacionData,
  removeMovimientoData,
} from 'src/app/form-data/liquidacion-movimiento';
import { Column } from 'src/app/interfaces/column';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientosSelectedDialogData } from 'src/app/interfaces/movimientos-selected-dialog';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { confirmationDialog } from 'src/app/utils/confirm';
import { openSnackbarWithMessage } from 'src/app/utils/snackbar';

@Component({
  selector: 'app-liquidacion-edit-form-movimientos',
  templateUrl: './liquidacion-edit-form-movimientos.component.html',
  styleUrls: ['./liquidacion-edit-form-movimientos.component.scss'],
})
export class LiquidacionEditFormMovimientosComponent {
  a = a;
  m = m;
  isShowOnly = false;
  columns: Column[] = [
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
      def: 'ver',
      title: '',
      type: 'button',
      value: () => 'Ver OC',
      isHidden: (mov: Movimiento) =>
        mov.tipo_documento_relacionado_descripcion === 'OC',
      buttonCallback: (element: Movimiento) => this.redirectToShowOC(element),
      stickyEnd: true,
    },
  ];

  get gestorCargaId(): number | undefined {
    return this.liquidacion?.gestor_carga_id;
  }

  @Input() liquidacion?: Liquidacion;
  @Input() list: Movimiento[] = [];
  @Input() saldo = 0;
  @Input() set isShow(value: boolean) {
    this.isShowOnly = value;
    if (value) {
      this.columns.unshift({
        def: 'id',
        title: 'Nº de Movimiento',
        value: (element: Movimiento) => element.id,
        sticky: true,
      });
    } else {
      this.columns.unshift(
        ...[
          {
            def: 'delete',
            title: '',
            type: 'button',
            value: () => 'Quitar Movimiento',
            buttonCallback: (mov: Movimiento) => this.removeMovimiento(mov),
            buttonIconName: () => 'delete',
            sticky: true,
          },
          {
            def: 'id',
            title: 'Nº de Movimiento',
            value: (element: Movimiento) => element.id,
          },
        ]
      );
    }
  }

  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService
  ) {}

  addMovimientos(): void {
    this.movimientoService
      .getListByEstadoCuenta(this.liquidacion!, LiquidacionEtapaEnum.PENDIENTE)
      .subscribe((list) => {
        const data: MovimientosSelectedDialogData = {
          contraparteInfo: this.liquidacion!,
          list,
          saldo: this.saldo,
        };
        this.dialog
          .open(MovimientosSelectedDialogComponent, {
            data,
            panelClass: 'full-dialog',
          })
          .afterClosed()
          .pipe(filter((list) => !!list && !!list.length))
          .subscribe((list: Movimiento[]) => {
            this.liquidacionService
              .addMovimientos(this.liquidacion!.id, createLiquidacionData(list))
              .subscribe(() => {
                openSnackbarWithMessage(
                  this.snackbar,
                  'Movimientos agregados',
                  () => {
                    this.selectedMovimientosChange.emit(list.concat(this.list));
                  }
                );
              });
          });
      });
  }

  removeMovimiento(movimiento: Movimiento): void {
    const message = `¿Está seguro que desea remover el movimiento Nº ${movimiento.id} de la lista?`;
    confirmationDialog(
      this.dialog,
      message,
      this.liquidacionService.removeMovimiento(
        this.liquidacion!.id,
        removeMovimientoData(movimiento)
      ),
      this.snackbar,
      'Movimiento removido',
      () => {
        this.selectedMovimientosChange.emit(
          this.list.filter((x) => x.id !== movimiento.id)
        );
      }
    );
  }

  private redirectToShowOC(mov: Movimiento): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        `/orden-carga/${m.ORDEN_CARGA}/${a.VER}`,
        mov.numero_documento_relacionado,
      ])
    );
    window.open(url, '_blank');
  }
}
