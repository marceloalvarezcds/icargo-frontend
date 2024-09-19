import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MovimientoEditByFleteFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-flete-form-dialog/movimiento-edit-by-flete-form-dialog.component';
import { MovimientoEditByMermaFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-merma-form-dialog/movimiento-edit-by-merma-form-dialog.component';
import { MovimientosSelectedDialogComponent } from 'src/app/dialogs/movimientos-selected-dialog/movimientos-selected-dialog.component';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
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
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoMermaEditFormDialogData } from 'src/app/interfaces/movimiento-merma-edit-form-dialog-data';
import { MovimientosSelectedDialogData } from 'src/app/interfaces/movimientos-selected-dialog';
import { CheckboxEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { getContraparteId } from 'src/app/utils/contraparte-info';
import {
  createMovimiento,
  deleteMovimiento,
  editMovimiento,
  redirectToShowOCByMovimiento,
} from 'src/app/utils/movimiento-utils';
import { edit } from 'src/app/utils/table-event-crud';

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
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
    },
    {
      def: 'punto_venta',
      title: 'Punto de Venta',
      value: (element: Movimiento) =>
        element.anticipo?.punto_venta_nombre ?? '',
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
  ];

  get gestorCargaId(): number | undefined {
    return this.liquidacion?.gestor_carga_id;
  }

  selectedItems: Movimiento[] = [];

  @Input() tipoContrapartePDV:boolean=false;
  @Input() tipoLiquidacion?:string;
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
            value: (mov: Movimiento) =>
              mov.es_editable ? 'Eliminar Movimiento' : 'Quitar Movimiento',
            buttonCallback: (mov: Movimiento) =>
              mov.es_editable ? this.delete(mov) : this.removeMovimiento(mov),
            buttonIconName: () => 'delete',
            sticky: true,
          },
          {
            def: 'id',
            title: 'Nº de Movimiento',
            value: (element: Movimiento) => element.id,
            type: 'checkbox',
            sticky: true,
          },
        ]
      );
    }
  }

  @Output() selectedMovimientosChange = new EventEmitter<Movimiento[]>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackbar: SnackbarService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService
  ) {}

  controlTipoMovimiento(movimientos: Movimiento[]): boolean {

    if (this.tipoContrapartePDV){

      let nuevoMovInsu = movimientos.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
        && mov.anticipo?.tipo_anticipo_descripcion === 'INSUMOS') );

      let nuevoMovAnti = movimientos.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
          && mov.anticipo?.tipo_anticipo_descripcion === 'EFECTIVO') );

      if (nuevoMovInsu && nuevoMovAnti) {
        return true;
      }

      let movInsu = this.list.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
        && mov.anticipo?.tipo_anticipo_descripcion === 'INSUMOS') );

      let movAnti = this.list.find( (mov) => (mov.tipo_movimiento_descripcion === 'Anticipo'
          && mov.anticipo?.tipo_anticipo_descripcion === 'EFECTIVO') );

      if (movInsu && nuevoMovAnti) {
        return true;
      }

      if (movAnti && nuevoMovInsu) {
        return true;
      }

    }

    return false;
  }

  addMovimientos(): void {
    let contraparteId = getContraparteId(this.liquidacion!);
    if (!contraparteId) {
      const queryContraparteId =
        this.route.snapshot.queryParamMap.get('contraparte_id');
      if (queryContraparteId) {
        contraparteId = parseInt(queryContraparteId, 10);
      }
    }
    if (!contraparteId) {
      console.error('La contraparteId es nula');
    }

    this.movimientoService
      .getListByEstadoCuenta(
        this.liquidacion!,
        contraparteId,
        LiquidacionEtapaEnum.PENDIENTE,
        this.liquidacion!.punto_venta_id
      )
      .subscribe((list) => {
        const data: MovimientosSelectedDialogData = {
          contraparteInfo: this.liquidacion!,
          list,
          saldo: this.saldo
        };
        this.dialog
          .open(MovimientosSelectedDialogComponent, {
            data,
            panelClass: 'full-dialog',
          })
          .afterClosed()
          .pipe(filter((list) => !!list && !!list.length))
          .subscribe((list: Movimiento[]) => {

            if (this.tipoContrapartePDV) {
              if (this.controlTipoMovimiento(list)) {
                this.snackbar.open('No se puede agregar movimientos de tipos diferentes');
                return;
              }
            }

            this.liquidacionService
              .addMovimientos(this.liquidacion!.id, createLiquidacionData(list))
              .subscribe(() => {
                this.snackbar.open('Movimientos agregados');
                this.selectedMovimientosChange.emit(list.concat(this.list));
              });

          });
      });
  }

  removeMovimiento(movimiento: Movimiento): void {
    const message = `¿Está seguro que desea remover el movimiento Nº ${movimiento.id} de la lista?`;
    this.dialogService.confirmationWithSnackbar(
      message,
      this.liquidacionService.removeMovimiento(
        this.liquidacion!.id,
        removeMovimientoData(movimiento)
      ),
      'Movimiento removido',
      () => {
        this.selectedMovimientosChange.emit(
          this.list.filter((x) => x.id !== movimiento.id)
        );

      }
    );
  }

  onAllCheckedChange(checked: boolean): void {
    if (checked) {
      this.selectedItems = this.list.slice();
    } else {
      this.selectedItems = [];
    }
  }

  onCheckboxChange(event: CheckboxEvent<Movimiento>): void {
    const item = event.value.row;
    if (event.event.checked) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter((m) => m.id !== item.id);
    }
  }

  removeMovimientos(): void {
    const movimientos = this.selectedItems.map((mov) => mov.id).join(', ');
    const message = `¿Está seguro que desea remover los movimients  Nº ${movimientos} de la lista?`;
    this.dialogService.confirmationWithSnackbar(
      message,
      this.liquidacionService.removeMovimientos(
        this.liquidacion!.id,
        createLiquidacionData(this.selectedItems)
      ),
      'Movimientos removido',
      () => {
        this.selectedMovimientosChange.emit(
          this.list.filter((x) => this.selectedItems.find( (y) => x.id === y.id ))
        );
      }
    );
  }

  createMovimiento(): void {
    const liquidacion = this.liquidacion!;
    const data: MovimientoFormDialogData = {
      liquidacion_id: liquidacion.id,
      tipo_contraparte_id: liquidacion.tipo_contraparte_id,
      contraparte: liquidacion.contraparte,
      contraparte_numero_documento: liquidacion.contraparte_numero_documento,
      estado: MovimientoEstadoEnum.EN_PROCESO,
      es_contraparte_editable: false,
      item: undefined,
    };
    createMovimiento(data, this.dialog, this.snackbar, () => {
      this.selectedMovimientosChange.emit(this.list);
    });
  }

  private edit(item: Movimiento): void {
    const data: MovimientoFormDialogData = {
      estado: MovimientoEstadoEnum.EN_PROCESO,
      liquidacion_id: this.liquidacion!.id,
      es_contraparte_editable: false,
      item,
    };
    editMovimiento(data, this.dialog, this.snackbar, () => {
      this.selectedMovimientosChange.emit(this.list);
    });
  }

  private delete(mov: Movimiento): void {
    deleteMovimiento(
      mov,
      this.dialog,
      this.movimientoService,
      this.snackbar,
      () => {
        this.selectedMovimientosChange.emit(
          this.list.filter((x) => x.id !== mov.id)
        );
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
    this.selectedMovimientosChange.emit(this.list);
  }
}
