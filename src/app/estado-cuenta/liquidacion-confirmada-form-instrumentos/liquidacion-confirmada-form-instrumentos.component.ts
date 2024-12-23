import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InstrumentoFormDialogComponent } from 'src/app/dialogs/instrumento-form-dialog/instrumento-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { addInstrumentosData } from 'src/app/form-data/liquidacion-instrumento';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { InstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { subtract } from 'src/app/utils/math';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-liquidacion-confirmada-form-instrumentos',
  templateUrl: './liquidacion-confirmada-form-instrumentos.component.html',
  styleUrls: ['./liquidacion-confirmada-form-instrumentos.component.scss'],
})
export class LiquidacionConfirmadaFormInstrumentosComponent {
  a = a;
  m = m;
  columns: Column[] = [
    {
      def: 'via_descripcion',
      title: 'Vía',
      value: (element: InstrumentoLiquidacionItem) => element.via_descripcion,
      sticky: true,
    },
    {
      def: 'cuenta_descripcion',
      title: 'Caja/Banco',
      value: (element: InstrumentoLiquidacionItem) =>
        element.cuenta_descripcion,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      type: 'only-date',
      value: (element: InstrumentoLiquidacionItem) => element.fecha_instrumento,
    },
    {
      def: 'tipo_instrumento_descripcion',
      title: 'Tipo de instrumento',
      value: (element: InstrumentoLiquidacionItem) =>
        element.tipo_instrumento_descripcion,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: InstrumentoLiquidacionItem) => element.monto,
      type: 'number',
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: InstrumentoLiquidacionItem) => element.numero_referencia,
    },
    {
      def: 'cheque_es_diferido',
      title: 'Es cheque diferido',
      value: (element: InstrumentoLiquidacionItem) =>
        element.cheque_es_diferido ? 'Si' : 'No',
    },
    {
      def: 'cheque_fecha_vencimiento',
      title: 'Fecha de vencimiento del cheque',
      value: (element: InstrumentoLiquidacionItem) =>
        element.cheque_fecha_vencimiento,
      type: 'only-date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];
  list: InstrumentoLiquidacionItem[] = [];

  get esSaldoAbierto(): boolean {
    return this.liquidacion?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO;
  }

  get gestorCargaId(): number | undefined {
    return this.liquidacion?.gestor_carga_id;
  }

  get residuo(): number {
    return subtract(Math.abs(this.saldo), this.valorInstrumentos);
  }

  get saldoCC():number {
    let saldoCC = (this.estadoCuenta?.confirmado ?? 0) + (this.estadoCuenta?.finalizado ?? 0);
    //let instrumento = this.list.reduce((acc, cur) => acc + cur.monto, 0);
    return saldoCC;
  }

  @Input() estadoCuenta?: EstadoCuenta;
  @Input() liquidacion?: Liquidacion;
  @Input() valorInstrumentos = 0;
  @Input() saldo = 0;
  @Input() isShow = false;
  @Input() set instrumentoList(list: InstrumentoLiquidacionItem[]) {
    if (!list.length) {
      this.list = [];
    }
  }

  @Output() listChange = new EventEmitter<InstrumentoLiquidacionItem[]>();
  @Output() residuoChange = new EventEmitter<number>();
  @Output() valorInstrumentosChange = new EventEmitter<number>();
  @Output() selectedInstrumentosChange = new EventEmitter<
    InstrumentoLiquidacionItem[]
  >();

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private liquidacionService: LiquidacionService
  ) {}

  create(): void {
    create(this.getDialogRef(), (item: InstrumentoLiquidacionItem) => {
      this.setResiduo(item.monto);
      this.list = this.list.concat([item]);
      this.listChange.emit(this.list);
    });
  }

  edit({ row, index }: TableEvent<InstrumentoLiquidacionItem>): void {
    edit(this.getDialogRef(row), (item: InstrumentoLiquidacionItem) => {
      this.setResiduo(subtract(item.monto, row.monto));
      const list = this.list.slice();
      list[index] = item;
      this.list = list;
      this.listChange.emit(this.list);
    });
  }

  remove({ row, index }: TableEvent<InstrumentoLiquidacionItem>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea eliminar al instrumeno Nº ${index + 1}?`,
      () => {
        this.setResiduo(row.monto * -1);
        this.list = this.list.filter((_, i) => i !== index);
        this.listChange.emit(this.list);
      }
    );
  }

  saveInstrumentos(): void {
    const list = this.list.slice().map( (ele:InstrumentoLiquidacionItem) => {
      ele.saldo_cc = (this.saldoCC - this.liquidacion!.pago_cobro!);
      return  ele
    });
    const message = `Por favor verifique que los datos de instrumentos y facturas estén correctos, luego de realizar esta acción no podrá modificar los datos de los mismos ¿ Desea guardar ?`;

    this.dialogService.confirmationWithSnackbar(
      message,
      this.liquidacionService.addInstrumentos(
        this.liquidacion!.id,
        addInstrumentosData(list)
      ),
      'Instrumentos agregados',
      () => {
        this.list = [];
        this.listChange.emit(this.list);
        this.selectedInstrumentosChange.emit(list);
      }
    );
  }

  private setResiduo(monto: number): void {
    this.valorInstrumentos += monto;
    this.residuoChange.emit(this.residuo);
    this.valorInstrumentosChange.emit(this.valorInstrumentos);
  }

  private getDialogRef(
    item?: InstrumentoLiquidacionItem
  ): MatDialogRef<InstrumentoFormDialogComponent, InstrumentoLiquidacionItem> {
    const data: InstrumentoFormDialogData = {
      es_cobro: this.liquidacion?.es_cobro ?? false,
      residuo: Math.abs((item?.monto ?? 0) + this.residuo),
      item,
    };
    return this.dialog.open(InstrumentoFormDialogComponent, {
      data,
      panelClass: 'half-dialog',
    });
  }
}
