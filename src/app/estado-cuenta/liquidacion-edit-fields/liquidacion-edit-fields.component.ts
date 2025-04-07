import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Moneda } from 'src/app/interfaces/moneda';

@Component({
  selector: 'app-liquidacion-edit-fields',
  templateUrl: './liquidacion-edit-fields.component.html',
  styleUrls: ['./liquidacion-edit-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidacionEditFieldsComponent implements OnChanges, AfterViewInit {

  E = LiquidacionEstadoEnum;

  @ViewChild('saldoView') childSaldoView!:SaldoComponent;

  @ViewChild('facturaList') liquidacionFacturasComponent?: LiquidacionConfirmadaFormFacturasComponent;

  @Input() etapa?: LiquidacionEtapaEnum;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() item?: Liquidacion;
  @Input() movimientos: Movimiento[] = [];
  @Input() isEdit = false;

  @Input() set liquidacion(liq:Liquidacion) {
    this.item = liq;
    if (liq.es_orden_pago){
      this.monto_pc.setValue(Math.abs(liq.pago_cobro!));
      this.form.controls['monto_pc'].addValidators([Validators.required, Validators.min(0)]);
      this.form.controls['monto_pc'].enable();
      this.form.controls['monto_pc'].updateValueAndValidity();
      this.form.controls['es_cobro'].enable();
      this.form.controls['moneda_id'].enable();
    };
    this.form.patchValue({
      moneda_id: liq.moneda_id
    });
    this.calcularTotalMoneda(liq.movimientos);
  }

  @Output() actualizarLiquidacion: EventEmitter<any> = new EventEmitter<any>();
  @Output() actualizarMovimientos: EventEmitter<any> = new EventEmitter<any>();
  @Output() actualizarEstado: EventEmitter<any> = new EventEmitter<any>();

  instrumentoInMemoryList: InstrumentoLiquidacionItem[] = [];
  liquidacionTipoEfectivo = false;
  liquidacionTipoInsumo = false;
  saldo = 0;
  monedaLocal?:Moneda;
  totalMonedas:any;

  colapseDivMovimientos = false;
  colapseDivFacturas = false;
  colapseDivInstrumentos = false;
  colapseDivHistorico = false;

  form = new FormGroup({
    monto_pc: new FormControl({value:null, disabled:true}, [Validators.required, Validators.min(0)] ),
    es_cobro: new FormControl({value:true, disabled:true }, [Validators.required]),
    moneda_id: new FormControl({value:null, disabled:true}, [Validators.required]),
  });

  get monto(): number {
    return subtract(this.credito, this.debito);
  }

  get credito(): number {
    return this.movimientos.reduce((acc, cur) => acc + ((this.monedaLocal?.id === cur.moneda_id) ? cur.credito: cur.credito_ml), 0);
  }

  get debito(): number {
    return this.movimientos.reduce((acc, cur) => acc + ((this.monedaLocal?.id === cur.moneda_id) ? cur.debito: cur.debito_ml), 0);
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
    return (this.item?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO ||
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

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get monto_pc(): FormControl {
    return this.form.controls['monto_pc'] as FormControl;
  }

  get saldoMovimientoLiquidacion(){
    return this.childSaldoView.saldoMovimiento;
  }

  get esOrdenPago():boolean {
    return this.item?.es_orden_pago ?? false;
  }

  get montoLiquidacion():number {
    return this.item!.es_orden_pago ? this.item!.pago_cobro! : this.monto;
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

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("changes: ", changes);
    for (const propName in changes) {
      const chng = changes[propName];
      /*if (propName === 'movimientos') {
        this.actualizarSaldos(chng.currentValue);
      }*/
      if (propName === 'liquidacion') {
        if (this.esFinalizado) {
          this.form.controls['monto_pc'].disable();
          this.form.controls['moneda_id'].disable();
          this.form.controls['es_cobro'].disable();
        }
      }
    }
  }

  /*actualizarSaldos(movs:Movimiento[]):void{
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
  }*/

  actualizarFactura(factura:Factura|null):void {
    //this.item!.pago_cobro = null;
    console.log("actualizarFactura: ", factura);
    if (factura)
      this.item!.facturas = this.item!.facturas ? [...this.item!.facturas, factura] : [factura];
    else this.item!.facturas = [];

    //this.liquidacionFacturasComponent?.loadList();
    this.actualizarMovimientos.emit(this.item);
  }

  actualizarMovimientosEvento(movimientos: Movimiento[]){
    //console.log("movimientos: ", movimientos);
    // recalcula saldo y monto pago cobro
    //this.item!.pago_cobro = null;
    if (this.esOrdenPago) return;

    this.calcularTotalMoneda(movimientos);

    this.actualizarMovimientos.emit(movimientos);
  }

  modificarLiquidacion():void {

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (!this.form.valid && this.liquidacion.es_orden_pago) {
      return;
    }

    let liquidacionValues = this.form.getRawValue();    
    let pago_cobro = this.esOrdenPago
      ?  liquidacionValues.es_cobro ? liquidacionValues.monto_pc : (liquidacionValues.monto_pc*-1)
      : 0;

    this.item!.pago_cobro = pago_cobro;
    this.item!.monto = pago_cobro;
    this.item!.es_pago_cobro = liquidacionValues.es_cobro ? 'PAGO' : 'COBRO';
    this.item!.moneda_id = liquidacionValues.moneda_id;

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

  selectMoneda(moneda: Moneda) {
    this.monedaLocal = moneda;
  }

  private calcularTotalMoneda(movimientos: Movimiento[]):void {

    const resultado = movimientos.reduce((acumulador:any, item) => {
      const { moneda, monto } = item;
      const clave = moneda.id; // Usamos el id como clave única

      if (!acumulador[clave]) {
        acumulador[clave] = {
          moneda: { ...moneda }, // Copiamos el objeto moneda
          total: 0,
          instrumento:0,
          residuo:0
        };
      }
      acumulador[clave].total += monto;
      acumulador[clave].residuo += monto;

      return acumulador;
    }, {});

    console.log("resultado: ", resultado);

    this.totalMonedas = Object.values(resultado);;
  }

}
