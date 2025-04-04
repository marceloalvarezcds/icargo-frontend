import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { createLiquidacionDataFields } from 'src/app/form-data/liquidacion-movimiento';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { LiquidacionFormMovimientosComponent } from '../liquidacion-form-movimientos/liquidacion-form-movimientos.component';
import { TipoLiquidacionEnum } from 'src/app/enums/tipo-liquidacion';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { Moneda } from 'src/app/interfaces/moneda';

@Component({
  selector: 'app-liquidacion-form-fields',
  templateUrl: './liquidacion-form-fields.component.html',
  styleUrls: ['./liquidacion-form-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiquidacionFormFieldsComponent implements AfterViewInit{

  @ViewChild('movimientosList')
  liquidacionMovimientoList!:LiquidacionFormMovimientosComponent;

  @Input() isDialog:Boolean = false;

  @Input() etapa?: LiquidacionEtapaEnum;

  @Input() estadoCuenta!: EstadoCuenta;

  @Input() list: Movimiento[] = [];

  @Input() esEditableLinea=false;

  @Input()
  set ordenPagoValue(value: boolean){
    this.esOrdenPago=value;
    if (value) {
      this.form.controls['monto_pc'].addValidators([Validators.required, Validators.min(0)]);
      this.form.controls['monto_pc'].enable();
      this.form.controls['monto_pc'].updateValueAndValidity();
      this.form.controls['es_cobro'].enable();
      this.form.controls['moneda_id'].enable();
      this.form.controls['es_insumo_efectivo'].disable();
      this.tipo_insumo.disable();
    }
  }

  @Input()
  set moneda(value: Moneda|undefined) {
    if (value) {
      this.monedaLocal = value;
      this.form.patchValue({
          moneda_id: value.id
      });
    }
  }

  @Output() createdLiquidacionEvt: EventEmitter<Liquidacion> = new EventEmitter<Liquidacion>();

  movimientosSelected: Movimiento[] = [];
  puntoVentaList?: PuntoVentaList[];
  monedaLocal?:Moneda;
  totalMonedas:any;
  esOrdenPago=false;

  form = new FormGroup({
    es_insumo_efectivo: new FormControl(true, Validators.required),
    tipo_insumo: new FormControl(null, Validators.required),
    punto_venta_id: new FormControl(null, Validators.required),
    monto_pc: new FormControl({value:null, disabled:true} ),
    es_cobro: new FormControl({value:true, disabled:true}, [Validators.required]),
    moneda_id: new FormControl({value:null, disabled:true}, [Validators.required]),
  });

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + ((this.monedaLocal?.id === cur.moneda_id) ? cur.credito: cur.credito_ml), 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + ((this.monedaLocal?.id === cur.moneda_id) ? cur.debito: cur.debito_ml), 0);
  }

  get monto(): number {
    return subtract(this.credito, this.debito);
  }

  get montoPagoCobro(): number {
    return this.form.controls['monto_pc'].value;
  }

  get saldoCC():number {
    return (this.estadoCuenta?.confirmado ?? 0) + (this.estadoCuenta?.finalizado ?? 0);
  }

  /*
  get tipoContrapartePDV():boolean{
    return (this.estadoCuenta ? this.estadoCuenta.tipo_contraparte_descripcion.includes("PDV") : false);
  }*/

  get esInsumoControl(): FormControl {
    return this.form.controls['es_insumo_efectivo'] as FormControl;
  }

  /*get esInsumoControlvalue(): FormControl {
    return this.form.controls['es_insumo_efectivo'].value;
  }*/

  get tipo_insumo(): FormControl {
    return this.form.controls['tipo_insumo'] as FormControl;
  }

  get puntoVentaId(): FormControl {
    return this.form.controls['punto_venta_id'] as FormControl;
  }

  /*get pagoCobro(): FormControl {
    return this.form.controls['es_cobro'] as FormControl;
  }

  get pagoCobroValue() {
    return this.form.controls['es_cobro'].value;
  }*/

  constructor(
    private movimientoService: MovimientoService,
    private liquidacionService: LiquidacionService,
    private puntoVentaService: PuntoVentaService,
    private snackbar: SnackbarService,
  ) { }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit")

    if (this.estadoCuenta!.es_pdv && !this.estadoCuenta?.tipo_flujo) {

      this.puntoVentaService.getList(this.estadoCuenta!.contraparte_id)
        .subscribe((resp:any) => {
          this.puntoVentaList = resp;
        });

      this.puntoVentaId.markAsTouched();

      this.puntoVentaId.valueChanges.subscribe( (val:boolean)=> {

        this.esInsumoControl.setValue(true);

      });

      this.esInsumoControl.valueChanges.subscribe( (val:boolean)=> {
        if (val) {

          this.tipo_insumo.removeValidators(Validators.required);
          this.tipo_insumo.updateValueAndValidity();

        } else {

          this.tipo_insumo.addValidators(Validators.required);
          this.tipo_insumo.updateValueAndValidity();

        }
      });

      this.puntoVentaId.valueChanges.subscribe( (val:number)=> {
        if (val) {
          const pdv = this.puntoVentaList?.find(item=> item.id == val);
          this.estadoCuenta!.contraparte_numero_documento_pdv = pdv?.numero_documento ?? '';
          this.estadoCuenta!.contraparte_pdv = pdv?.nombre_corto ?? '';
        }
      });

    } else {

      this.esInsumoControl.removeValidators(Validators.required);
      this.tipo_insumo.removeValidators(Validators.required);
      this.puntoVentaId.removeValidators(Validators.required);

      this.esInsumoControl.updateValueAndValidity();
      this.tipo_insumo.updateValueAndValidity();
      this.puntoVentaId.updateValueAndValidity();

    }

    if (this.estadoCuenta?.tipo_flujo ) {
      const esEfectivo = this.estadoCuenta?.tipo_flujo === 'EFECTIVO';
      this.esInsumoControl.setValue( esEfectivo ? 'EFECTIVO' : 'INSUMO');
      this.tipo_insumo.setValue(this.estadoCuenta?.tipo_flujo);
      this.puntoVentaId.setValue(this.estadoCuenta?.punto_venta_id);
      this.esInsumoControl.setValue( esEfectivo );

      this.esInsumoControl.disable();
      this.tipo_insumo.disable();
      this.puntoVentaId.disable();
      this.esInsumoControl.disable();
    }
  }

  validateForm():boolean{

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return false;
    } else {
      return true;
    }

  }

  sendLiquidacion(confirmed: boolean): void {

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    let liquidacionValues = this.form.getRawValue();
    let es_pago_cobro = liquidacionValues.es_cobro ? 'PAGO' : 'COBRO';
    let tipoMovLiquidacion = this.estadoCuenta!.es_pdv ? '' : TipoLiquidacionEnum.EFECTIVO.toUpperCase();
    let pago_cobro = this.esOrdenPago
      ?  liquidacionValues.es_cobro ? liquidacionValues.monto_pc : (liquidacionValues.monto_pc*-1)
      : 0;
    let moneda = this.monedaLocal;

    if (this.estadoCuenta!.es_pdv){

      if (this.estadoCuenta!.punto_venta_id === 0) {
        this.estadoCuenta!.punto_venta_id = liquidacionValues.punto_venta_id;
      }

      tipoMovLiquidacion = liquidacionValues.es_insumo_efectivo
          ? TipoLiquidacionEnum.EFECTIVO.toUpperCase()
          : tipoMovLiquidacion = liquidacionValues.tipo_insumo ;
    }

    //if (this.movimientosSelected.length) {
      this.liquidacionService
        .create(
            createLiquidacionDataFields(
              this.movimientosSelected, this.estadoCuenta, pago_cobro, es_pago_cobro, tipoMovLiquidacion, moneda as Moneda, this.esOrdenPago
            ))
        .subscribe((resp) => {
          this.snackbar.open('Datos guardados satisfactoriamente');

          this.createdLiquidacionEvt.emit(resp);

          /*if (confirmed) {
            this.router.navigate([backUrl]);
          } else {
            if (isDialog){
              this.createdLiquidacion.emit(resp);
            } else {
              this.getData();
            }
          }*/

          this.form.reset();

          this.movimientosSelected.splice(0, this.movimientosSelected.length);
        });
    //} else {
    //  this.snackbar.open('Debe elegir al menos 1 movimiento');
    //}

  }

  getList() {

    if (this.esOrdenPago) return;

    const etapa = this.etapa! as LiquidacionEtapaEnum;

    let listar_efectivo_insumo = this.esInsumoControl.value ? "EFECTIVO" : "INSUMO";

    if (listar_efectivo_insumo !== "EFECTIVO") {
      listar_efectivo_insumo = this.tipo_insumo.value;
    }

    const puntoVenta = this.estadoCuenta!.punto_venta_id! >0 ? this.estadoCuenta!.punto_venta_id : this.puntoVentaId.value;

    this.movimientoService
      .getListByEstadoCuenta(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        etapa,
        puntoVenta,
        listar_efectivo_insumo
      )
      .subscribe((data) => {
        this.list = data;
        this.movimientosSelected = [];
      });
  }

  filtrarMovimientosPDV2(filter:string){

    if (this.esOrdenPago) return;

    this.liquidacionMovimientoList!.clearMovimientosList();

    const puntoVenta = this.puntoVentaId.value;

    if (!puntoVenta) {
      return;
    }

    if (filter === 'INSUMO' && !this.tipo_insumo.value ) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    this.getList();
  }

  cargarMovimientos(movimientos: Movimiento[]) {

    if (this.esOrdenPago) return;

    this.movimientosSelected = movimientos;
    this.form.controls['monto_pc'].setValue(Math.abs(this.monto));

    this.calcularTotalMoneda(movimientos);

    if (this.monto>=0) {
      this.form.controls['es_cobro'].setValue(true);
    } else {
      this.form.controls['es_cobro'].setValue(false);
    }
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
          total: 0
        };
      }
      acumulador[clave].total += monto;

      return acumulador;
    }, {});

    console.log("resultado: ", resultado);

    this.totalMonedas = Object.values(resultado);;
  }

}
