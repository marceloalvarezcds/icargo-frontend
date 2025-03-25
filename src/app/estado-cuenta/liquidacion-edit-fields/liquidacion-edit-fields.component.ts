import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Instrumento, InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { subtract } from 'src/app/utils/math';
import { SaldoComponent } from '../saldo/saldo.component';
import { editLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { LiquidacionConfirmadaFormFacturasComponent } from '../liquidacion-confirmada-form-facturas/liquidacion-confirmada-form-facturas.component';
import { Factura } from 'src/app/interfaces/factura';
import { LiquidacionEditFormMovimientosComponent } from '../liquidacion-edit-form-movimientos/liquidacion-edit-form-movimientos.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-liquidacion-edit-fields',
  templateUrl: './liquidacion-edit-fields.component.html',
  styleUrls: ['./liquidacion-edit-fields.component.scss']
})
export class LiquidacionEditFieldsComponent implements OnChanges, AfterViewInit {

  E = LiquidacionEstadoEnum;

  @ViewChild('saldoView')
  childSaldoView!:SaldoComponent;

  @ViewChild('facturaList')
  liquidacionFacturasComponent?: LiquidacionConfirmadaFormFacturasComponent;

  @Input() etapa?: LiquidacionEtapaEnum;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() item?: Liquidacion;
  @Input() movimientos: Movimiento[] = [];
  @Input() isEdit = false;

  @Input() set liquidacion(liq:Liquidacion) {
    this.item = liq;
    this.monto_pc.setValue(Math.abs(this.monto));
  }

  @Output() actualizarLiquidacion: EventEmitter<any> = new EventEmitter<any>();
  @Output() actualizarMovimientos: EventEmitter<any> = new EventEmitter<any>();
  @Output() actualizarEstado: EventEmitter<any> = new EventEmitter<any>();

  instrumentoInMemoryList: InstrumentoLiquidacionItem[] = [];
  saldo = 0;
  liquidacionTipoEfectivo = false;
  liquidacionTipoInsumo = false;

  colapseDivMovimientos = false;
  colapseDivFacturas = false;
  colapseDivInstrumentos = false;
  colapseDivHistorico = false;

  form = new FormGroup({
    monto_pc: new FormControl(null, [Validators.required, Validators.min(0)] ),
    es_cobro: new FormControl(true, Validators.required),
    moneda_id: new FormControl(null, Validators.required),
  });

  get monto(): number {
    return this.item?.pago_cobro ?? subtract(this.credito, this.debito);
  }

  get montoSaldo(): number {
    return (this.childSaldoView?.monto ?? 0);
  }

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get saldoCC():number {
    return (this.estadoCuenta?.confirmado ?? 0) + (this.estadoCuenta?.finalizado ?? 0);
  }

  get saldoFinalizado(): number | undefined {
    return (this.item?.etapa === 'Finalizado') ? this.item.saldo_cc : undefined;
  }

  get esFinalizado(): boolean {
    return (this.item?.estado === LiquidacionEstadoEnum.PENDIENTE ||
      this.item?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO ||
      this.item?.estado === LiquidacionEstadoEnum.SALDO_CERRADO  ||
      this.item?.estado === LiquidacionEstadoEnum.FINALIZADO);
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
  }

  get facturas(): Factura[] {
    return this.item?.facturas ?? [];
  }

  get residuo(): number {
    return this.item?.saldo_residual ?? 0;
  }

  get valorInstrumentos(): number {
    return this.item?.instrumentos_saldo ?? 0;
  }

  get pago_cobro_abs():number {
    return Math.abs(this.item!.pago_cobro!);
  }

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get monto_pc(): FormControl {
    return this.form.controls['monto_pc'] as FormControl;
  }

  get monto_pc_value(): number {
    return this.monto_pc.value;
  }

  get saldoMovimientoLiquidacion(){
    return this.childSaldoView.saldoMovimiento;
  }

  get pagoCobro(): FormControl {
    return this.form.controls['es_cobro'] as FormControl;
  }

  get pagoCobroValue() {
    return this.form.controls['es_cobro'].value;
  }

  constructor(
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private snackbar: SnackbarService,
  ) { }

  ngAfterViewInit(): void {

    if (this.item!.es_pago_cobro === 'PAGO') {
      this.form.controls['es_cobro'].setValue(true);
    } else {
      this.form.controls['es_cobro'].setValue(false);
    }

    if (this.esFinalizado) {
      this.form.controls['monto_pc'].disable();
      this.form.controls['moneda_id'].disable();
      this.form.controls['es_cobro'].disable();
    }

    setTimeout(() => {
      this.monto_pc.setValue(Math.abs(this.item!.pago_cobro!));
    }, 500);

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes: ", changes);
    for (const propName in changes) {
      const chng = changes[propName];
      if (propName === 'movimientos') {
        this.actualizarSaldos(chng.currentValue);
      }
      if (propName === 'liquidacion') {
        if (this.esFinalizado) {
          this.form.controls['monto_pc'].disable();
          this.form.controls['moneda_id'].disable();
          this.form.controls['es_cobro'].disable();
        }
      }
    }
  }

  actualizarSaldos(movs:Movimiento[]):void{
    console.log("this.item!.pago_cobro: ", this.item!.pago_cobro);
    if (this.item!.pago_cobro === null) {
      const deb = movs.reduce((acc, cur) => acc + cur.debito, 0);
      const cred = movs.reduce((acc, cur) => acc + cur.credito, 0);
      this.item!.debito = deb;
      this.item!.credito = cred;
      this.item!.pago_cobro = subtract(cred, deb);
      this.monto_pc.setValue(Math.abs(this.item!.pago_cobro!));
    }

    if (this.item!.pago_cobro!=0)
      if (this.item!.pago_cobro>0) {
        this.form.controls['es_cobro'].setValue(true);
      } else {
        this.form.controls['es_cobro'].setValue(false);
      }
  }

  actualizarFactura():void {
    //this.item!.pago_cobro = null;
    //this.liquidacionFacturasComponent?.loadList();
    //this.actualizarMovimientos.emit(this.item);
  }

  actualizarMovimientosEvento(movimientos: Movimiento[]){
    console.log("movimientos: ", movimientos);
    // recalcula saldo y monto pago cobro
    this.item!.pago_cobro = null;
    this.actualizarMovimientos.emit(movimientos);
  }

  modificarLiquidacion():void {

    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let es_pago_cobro = (this.saldoMovimientoLiquidacion >= 0) ? 'PAGO' : 'COBRO';
    let pago_cobro = es_pago_cobro === 'PAGO' ? this.monto_pc.value : (this.monto_pc.value*-1);

    this.item!.monto = pago_cobro;

    const pagoCobro = this.pagoCobroValue;
    const moneda = this.form.controls['moneda_id'].value;

    console.log("pagoCobro value: ", pagoCobro);
    if ( !pagoCobro ) {
      this.item!.monto = Math.abs(pago_cobro)*-1;
      this.item!.es_pago_cobro='COBRO';
    } else {
      this.item!.monto = Math.abs(pago_cobro);
      this.item!.es_pago_cobro='PAGO';
    }

    this.item!.moneda_id = moneda.id;

    console.log("moneda: ", moneda);
    console.log("this.monto_pc.value: ", this.monto_pc.value);
    console.log("pagoCobro: ", pagoCobro);

    this.liquidacionService
      .edit(this.item!.id, editLiquidacionData(this.item!))
      .subscribe((resp) => {
        this.snackbar.open('Datos guardados satisfactoriamente');

        //this.actualizarLiquidacion.emit(resp);

        /*if (confirmed) {
          this.router.navigate([backUrl]);
        } else {
          if (isDialog){
            this.createdLiquidacion.emit(resp);
          } else {
            this.getData();
          }
        }*/

        //this.movimientos.splice(0, this.movimientos.length);
      });
  }

}
