import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
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
import { SaldoComponent } from '../saldo/saldo.component';
import { LiquidacionFormMovimientosComponent } from '../liquidacion-form-movimientos/liquidacion-form-movimientos.component';
import { TipoLiquidacionEnum } from 'src/app/enums/tipo-liquidacion';

@Component({
  selector: 'app-liquidacion-form-fields',
  templateUrl: './liquidacion-form-fields.component.html',
  styleUrls: ['./liquidacion-form-fields.component.scss']
})
export class LiquidacionFormFieldsComponent implements AfterViewInit{

  private readonly monedaIdGs = 1;

  @ViewChild('saldoView')
  childSaldoView!:SaldoComponent;

  @ViewChild('movimientosList')
  liquidacionMovimientoList!:LiquidacionFormMovimientosComponent;

  @Input()
  isDialog:Boolean = false;

  @Input()
  etapa?: LiquidacionEtapaEnum;

  @Input()
  estadoCuenta?: EstadoCuenta;

  @Input()
  list: Movimiento[] = [];

  @Input()
  esEditableLinea=false;

  @Output()
  createdLiquidacionEvt: EventEmitter<Liquidacion> = new EventEmitter<Liquidacion>();

  movimientosSelected: Movimiento[] = [];

  form = new FormGroup({
    monto_pc: new FormControl(null, [Validators.required, Validators.min(0)] ),
    es_insumo_efectivo: new FormControl(true, Validators.required),
    tipo_insumo: new FormControl(null, Validators.required),
    punto_venta_id: new FormControl(null, Validators.required),
  });

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get monto(): number {
    return subtract(this.credito, this.debito);
  }

  get saldoCC():number {
    return (this.estadoCuenta?.confirmado ?? 0) + (this.estadoCuenta?.finalizado ?? 0);
  }

  get tipoContrapartePDV():boolean{
    return (this.estadoCuenta ? this.estadoCuenta.tipo_contraparte_descripcion.includes("PDV") : false);
  }

  get esInsumoControl(): FormControl {
    return this.form.controls['es_insumo_efectivo'] as FormControl;
  }

  get esInsumoControlvalue(): FormControl {
    return this.form.controls['es_insumo_efectivo'].value;
  }

  get tipo_insumo(): FormControl {
    return this.form.controls['tipo_insumo'] as FormControl;
  }

  get puntoVentaId(): FormControl {
    return this.form.controls['punto_venta_id'] as FormControl;
  }

  get monto_pc(): FormControl {
    return this.form.controls['monto_pc'] as FormControl;
  }

  get saldoMovimientoLiquidacion(){
    return this.childSaldoView.saldoMovimiento;
  }

  constructor(
    private movimientoService: MovimientoService,
    private liquidacionService: LiquidacionService,
    private snackbar: SnackbarService,
  ) { }

  ngAfterViewInit(): void {

    if (this.estadoCuenta!.es_pdv && !this.estadoCuenta?.tipo_flujo) {
      this.form.controls['punto_venta_id'].markAsTouched();

      this.puntoVentaId.valueChanges.subscribe( (val:boolean)=> {

        this.esInsumoControl.setValue(true);

      });

      this.esInsumoControl.valueChanges.subscribe( (val:boolean)=> {
        if (val) {

          this.form.controls['tipo_insumo'].removeValidators(Validators.required);
          this.form.controls['tipo_insumo'].updateValueAndValidity();

        } else {

          this.form.controls['tipo_insumo'].addValidators(Validators.required);
          this.form.controls['tipo_insumo'].updateValueAndValidity();

        }
      });

    } else {

      this.form.controls['es_insumo_efectivo'].removeValidators(Validators.required);
      this.form.controls['tipo_insumo'].removeValidators(Validators.required);
      this.form.controls['punto_venta_id'].removeValidators(Validators.required);

      this.form.controls['es_insumo_efectivo'].updateValueAndValidity();
      this.form.controls['tipo_insumo'].updateValueAndValidity();
      this.form.controls['punto_venta_id'].updateValueAndValidity();

    }

    if (this.estadoCuenta?.tipo_flujo ) {

      const esEfectivo = this.estadoCuenta?.tipo_flujo === 'EFECTIVO';
      this.form.controls['es_insumo_efectivo'].setValue( esEfectivo ? 'EFECTIVO' : 'INSUMO');
      this.form.controls['tipo_insumo'].setValue(this.estadoCuenta?.tipo_flujo);
      this.form.controls['punto_venta_id'].setValue(this.estadoCuenta?.punto_venta_id);
      this.esInsumoControl.setValue( esEfectivo );

      this.form.controls['es_insumo_efectivo'].disable();
      this.form.controls['tipo_insumo'].disable();
      this.form.controls['punto_venta_id'].disable();
      this.esInsumoControl.disable();

    }
  }

  sendLiquidacion(confirmed: boolean): void {

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      console.log("form invalido, verificar!!!");
      return;
    }

    let es_pago_cobro = (this.saldoMovimientoLiquidacion >= 0) ? 'PAGO' : 'COBRO';
    let pago_cobro = 0; //es_pago_cobro === 'PAGO' ? Math.abs(this.childSaldoView.monto) : Math.abs(this.childSaldoView.monto)*-1 ;
    pago_cobro = es_pago_cobro === 'PAGO' ? this.monto_pc.value : (this.monto_pc.value*-1);

    let tipoMovLiquidacion = '';

    console.log("datos: ");
    console.log(":: ", this.estadoCuenta!.punto_venta_id);
    console.log(":: ", this.estadoCuenta!.es_pdv);


    if (this.estadoCuenta!.punto_venta_id || this.estadoCuenta!.es_pdv){
      //tipoMovLiquidacion = this.estadoCuenta!.tipo_flujo!;
      let listar_efectivo_insumo = this.esInsumoControl.value ? "EFECTIVO" : "INSUMO";

      if (listar_efectivo_insumo !== "EFECTIVO") {
        tipoMovLiquidacion = this.tipo_insumo.value;
      } else {
        tipoMovLiquidacion = TipoLiquidacionEnum.EFECTIVO.toUpperCase();
      }

    } else {
      tipoMovLiquidacion = TipoLiquidacionEnum.EFECTIVO.toUpperCase();
    }

    // TODO: seleccionar la moneda en el form, por ahora sino tiene movimientos sera en gs
    if (this.movimientosSelected.length === 0) {
      this.estadoCuenta!.moneda_id = this.monedaIdGs;
    } else {
      this.estadoCuenta!.moneda_id = this.movimientosSelected[0].moneda_id;
    }

    //if (this.movimientosSelected.length) {
      this.liquidacionService
        .create(
            createLiquidacionDataFields(
              this.movimientosSelected, this.estadoCuenta!, pago_cobro, es_pago_cobro, tipoMovLiquidacion
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

  getList(): void {

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

  filtrarMovimientosPDV():void{
    this.liquidacionMovimientoList!.clearMovimientosList();
    const listar_efectivo_insumo = this.esInsumoControl.value ? "EFECTIVO" : "INSUMO";
    const puntoVenta = this.puntoVentaId.value;

    if (!puntoVenta) {
      return;
    }

    if (listar_efectivo_insumo === 'INSUMO' && !this.tipo_insumo.value ) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    this.getList();
  }

  filtrarMovimientosPDV2(filter:string):void{
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

  cargarMovimientos(movimientos: Movimiento[]):void {
    this.movimientosSelected = movimientos;
    this.monto_pc.setValue(Math.abs(this.monto));
  }

}
