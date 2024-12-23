import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FacturaFormDialogComponent } from 'src/app/dialogs/factura-form-dialog/factura-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Factura } from 'src/app/interfaces/factura';
import { FacturaFormDialogData } from 'src/app/interfaces/factura-form-dialog-data';
import { InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { FacturaService } from 'src/app/services/factura.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-liquidacion-confirmada-form-facturas',
  templateUrl: './liquidacion-confirmada-form-facturas.component.html',
  styleUrls: ['./liquidacion-confirmada-form-facturas.component.scss'],
})
export class LiquidacionConfirmadaFormFacturasComponent implements OnInit {
  E = LiquidacionEstadoEnum;

  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: Factura) => element.id,
      sticky: true,
    },
    {
      def: 'numero_factura',
      title: 'Nº de Factura',
      value: (element: Factura) => element.numero_factura,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Factura) => element.monto,
      type: 'number',
    },
    {
      def: 'iva_descripcion',
      title: 'IVA',
      value: (element: Factura) => element.iva_descripcion,
    },
    {
      def: 'fecha_vencimiento',
      title: 'Fecha de Vencimiento',
      type: 'only-date',
      value: (element: Factura) => element.fecha_vencimiento,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Factura) => element.moneda_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Factura) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      type: 'date-time',
      value: (element: Factura) => element.created_at,
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Factura) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      type: 'date-time',
      value: (element: Factura) => element.modified_at,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  list: Factura[] = [];
  montoSuma = 0;
  montoLimite = 0;

  get gestorCargaId(): number | undefined {
    return this.liquidacion.gestor_carga_id;
  }

  get residuo(): number {
    return subtract(this.montoLimite, this.montoSuma);
  }

  get isFacturaReady():boolean {
    return this.list ? (this.list.length>0) : false;
  }

  get liquidacionFinalizada(): boolean | undefined {
    return (this.liquidacion?.etapa === 'Finalizado' ||
          this.liquidacion?.etapa === 'Confirmado') ? true : false;
  }

  @Input() instrumentoInMemoryList: InstrumentoLiquidacionItem[] = [];
  @Input() liquidacion!: Liquidacion;
  @Input() isShow = false;

  @Output() emptyInstrumentoListChange = new EventEmitter<void>();
  @Output() facturasChange = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackbar: SnackbarService,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  create(): void {
    this.showAlertMessage(() =>
      create(this.getDialogRef(), this.emitChange.bind(this))
    );
  }

  edit({ row }: TableEvent<Factura>): void {

    if (this.liquidacionFinalizada) {
      this.snackbar.open( 'No se puede editar Factura de liquidacion cerrada');
      return;
    }

    this.showAlertMessage(() =>
      edit(this.getDialogRef(row, false), ()=>this.emitChange("Procesado con exito!"))
    );
  }

  show({ row }: TableEvent<Factura>): void {
    this.showAlertMessage(() =>
      edit(this.getDialogRef(row, true), ()=>this.emitChange("Procesado con exito!"))
    );
  }

  remove({ row }: TableEvent<Factura>): void {

    if (this.liquidacionFinalizada) {
      this.snackbar.open( 'No se puede eliminar Factura de liquidacion cerrada');
      return;
    }

    this.showAlertMessage(() =>
      remove(
        this.dialog,
        `¿Está seguro que desea eliminar la Factura Nº ${row.numero_factura}?`,
        () => {
          this.facturaService
            .delete(row.id)
            .subscribe( (r) => this.emitChange("Factura eliminada!") );
        }
      )
    );
  }

  private getDialogRef(
    item?: Factura,
    isShow?: boolean,
  ): MatDialogRef<FacturaFormDialogComponent, Factura> {

    const contraparteId = this.liquidacion.chofer_id ?? this.liquidacion.propietario_id
    ?? this.liquidacion.proveedor_id ?? this.liquidacion.remitente_id;

    const data: FacturaFormDialogData = {
      liquidacion_id: this.liquidacion.id,
      tipo_contraparte_id: this.liquidacion.tipo_contraparte_id,
      contraparte_id: contraparteId!,
      contribuyente: this.liquidacion.contraparte,
      ruc: this.liquidacion.contraparte_numero_documento,
      valor_operacion: this.residuo + (item?.monto ?? this.liquidacion.pago_cobro ?? 0),
      isShow,
      item,
    };
    return this.dialog.open(FacturaFormDialogComponent, { data, panelClass: 'half-dialog', });
  }

  private emitChange(mensaje:string): void {
    this.snackbar.open( mensaje ?? 'Factura agregada');
    this.facturasChange.emit();
    this.loadList();
  }

  public loadList(): void {
    this.facturaService
      .getListByLiquidacionId(this.liquidacion.id)
      .subscribe((list) => {
        this.list = list;
        this.montoSuma = list.reduce((acc, cur) => acc + cur.monto, 0);
        this.montoLimite = Math.abs(this.liquidacion.movimientos_saldo);
      });
  }

  private showAlertMessage(observer: () => void): void {
    if (this.instrumentoInMemoryList.length) {
      this.dialogService.confirmation(
        'Existen Instrumentos sin guardar, si continua con esta acción se perderan los cambios ¿Está seguro?',
        () => {
          this.emptyInstrumentoListChange.emit();
          observer();
        }
      );
    } else {
      observer();
    }
  }

}
