import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComentarioConfirmDialogComponent } from 'src/app/dialogs/comentario-confirm-dialog/comentario-confirm-dialog.component';
import { InstrumentoFormDialogComponent } from 'src/app/dialogs/instrumento-form-dialog/instrumento-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { OperacionEstadoEnum } from 'src/app/enums/operacion-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { changeLiquidacionDataMonto } from 'src/app/form-data/liquidacion';
import { addInstrumentosData } from 'src/app/form-data/liquidacion-instrumento';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Instrumento, InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { InstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Moneda } from 'src/app/interfaces/moneda';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

type MonetaTotalType = {
  moneda:Moneda,
  total:number,
  instrumento:number,
  residuo:number,
}

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
      def: 'moneda',
      title: 'Moneda',
      value: (element: InstrumentoLiquidacionItem) => element.moneda_abr,
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Tipo Cambio',
      value: (element: InstrumentoLiquidacionItem) => element.tipo_cambio_moneda,
      type: 'number',
    },
    {
      def: 'monto_ml',
      title: 'Monto ML',
      value: (element: InstrumentoLiquidacionItem) => element.monto_ml,
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
  //list: InstrumentoLiquidacionItem[] = [];
  list: Instrumento[] = [];

  get esSaldoAbierto(): boolean {
    return this.liquidacion?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO;
  }

  get gestorCargaId(): number | undefined {
    return this.liquidacion?.gestor_carga_id;
  }

  get residuo(): number {
    //return subtract(Math.abs(this.saldo), this.valorInstrumentos);
    //let saldo = this.totalMonedas.reduce((acc:number, cur:any) => acc + cur.total_ml, 0);
    return subtract(Math.abs(this.saldo ?? 0), this.totalInstrumentos);
  }

  get residuoInstrumento(): number {
    let totalInstrumentos = this.liquidacion?.instrumentos.reduce((acc, cur) => acc + ( (cur.operacion_estado !== OperacionEstadoEnum.RECHAZADO && cur.operacion_estado !== OperacionEstadoEnum.ANULADO) ? cur.monto_ml : 0 ), 0);
    return subtract(Math.abs(this.saldo ?? 0), Math.abs(totalInstrumentos ?? 0));
  }

  get saldoCC():number {
    let saldoCC = (this.estadoCuenta?.confirmado ?? 0) + (this.estadoCuenta?.finalizado ?? 0);
    //let instrumento = this.list.reduce((acc, cur) => acc + cur.monto, 0);
    return saldoCC;
  }

  get totalInstrumentos(){
    return this.list.reduce((acc, cur) => acc + cur.monto_ml, 0);
  }

  @Input() estadoCuenta?: EstadoCuenta;
  @Input() liquidacion?: Liquidacion;
  @Input() valorInstrumentos = 0;
  @Input() saldo = 0;
  @Input() isShow = false;
  @Input() totalMonedas:MonetaTotalType[] = [];
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
  @Output() instrumentosChange = new EventEmitter<Instrumento>();

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
    private liquidacionService: LiquidacionService,
    private snackbar: SnackbarService,
  ) {}

  create(): void {
    create(this.getDialogRef(), (item:  Instrumento) => {
      console.log("on create instrumento")
      //this.totalMonedas = item.totales;
      //this.setResiduo(item.monto, item.moneda_id);
      this.list = this.list.concat([item]);
      //this.listChange.emit(this.list);
      this.instrumentosChange.emit(item);
    });
  }

  cierreForzado(): void {
    const message = `Está seguro que desea Forzar el CIERRE la Liquidación Nº ${this.liquidacion!.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: true,
        },
      }),
      (comentario: string) => {
        const form = {comentario:comentario};
        this.liquidacionService
          .cierreForzado(this.liquidacion!.id, changeLiquidacionDataMonto(form))
          .subscribe(() => {
            this.snackbar.changeStatus();
            this.instrumentosChange.emit(undefined);
          });
      }
    );

  }

  edit(): void {

  }
  /*edit({ row, index }: TableEvent<InstrumentoLiquidacionItem>): void {
    console.log("row: ", row);
    //this.valorInstrumentos -= row.monto_ml;
    console.log("index: ", index);
    edit(this.getDialogRef(row), (item: InstrumentoLiquidacionItem) => {
      //this.setResiduo(subtract(item.monto, row.monto), item.moneda_id);
      //this.totalMonedas = item.totales;
      const list = this.list.slice();
      //list[index] = item;
      this.list = list;
      //this.instrumentosChange.emit(item);
    });
  }*/

  remove({ row, index }: TableEvent<Instrumento>): void {
    remove(
      this.dialog,
      `¿Está seguro que desea ANULAR el instrumeno Nº ${index + 1}?`,
      () => {
        //this.setResiduo((row.monto * -1), row.moneda_id);
        this.list = this.list.filter((_, i) => i !== index);
        //this.listChange.emit(this.list);
      }
    );
  }

  suma(num1:number, num2:number): number {
    return num1+num2
  }

  resta(num1:number, num2:number): number {
    return num1-num2
  }

  saveInstrumentos(): void {
    /*const list = this.list.slice().map( (ele:InstrumentoLiquidacionItem) => {
      ele.saldo_cc = ( this.saldoCC>0
          ? this.suma(this.saldoCC, this.liquidacion!.pago_cobro!*-1)
          : this.resta(this.saldoCC, this.liquidacion!.pago_cobro!)
      );
      console.log(`ele.saldo_cc = (${this.saldoCC} + ${this.liquidacion!.pago_cobro!});`);
      console.log(`ele.saldo_cc: `, ele.saldo_cc);
      return  ele
    });*/
    const message = `Por favor verifique que los datos de instrumentos y facturas estén correctos, luego de realizar esta acción no podrá modificar los datos de los mismos ¿ Desea guardar ?`;

    this.dialogService.confirmationWithSnackbar(
      message,
      this.liquidacionService.addInstrumentos(
        this.liquidacion!.id,
        //addInstrumentosData([list])
        addInstrumentosData([])
      ),
      'Instrumentos agregados',
      () => {
        this.list = [];
        //this.listChange.emit(this.list);
        //this.selectedInstrumentosChange.emit(list);
        this.selectedInstrumentosChange.emit([]);
      }
    );
  }

  private setResiduo(monto: number, moneda_id:number): void {
    //this.valorInstrumentos += monto;
    this.totalMonedas.map( (t:MonetaTotalType) => {
      if (t.moneda.id === moneda_id){
        t.instrumento +=monto;
        t.residuo = t.total - t.instrumento;
      }
    });
    console.log("this.totalMonedas: ", this.totalMonedas);
    //this.residuoChange.emit(this.residuo);
    //this.valorInstrumentosChange.emit(this.valorInstrumentos);
  }

  private getDialogRef(
    item?: InstrumentoLiquidacionItem
  ): MatDialogRef<InstrumentoFormDialogComponent, InstrumentoLiquidacionItem> {

    const data: InstrumentoFormDialogData = {
      es_cobro: this.liquidacion?.es_cobro ?? false,
      residuo: Math.abs((item?.monto_ml ?? 0) + this.residuoInstrumento),
      totalLiquidacion: Math.abs(this.saldo ?? 0),
      item,
      totalMonedas: this.totalMonedas,
      moneda_liquidacion: this.liquidacion!.moneda_id,
      liquidacion_id: this.liquidacion!.id
    };
    return this.dialog.open(InstrumentoFormDialogComponent, {
      data,
      panelClass: 'half-dialog',
    });
  }
}

