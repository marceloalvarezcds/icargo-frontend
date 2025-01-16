import { Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
export class LiquidacionFormFieldsComponent {

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
    es_insumo_efectivo: new FormControl(true),
    tipo_insumo: new FormControl(null),
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

  constructor(
    private movimientoService: MovimientoService,
    private liquidacionService: LiquidacionService,
    private snackbar: SnackbarService,
  ) { }


  sendLiquidacion(confirmed: boolean): void {

    let es_pago_cobro = (this.childSaldoView.saldoMovimiento >= 0) ? 'PAGO' : 'COBRO';
    let pago_cobro = es_pago_cobro === 'PAGO' ? Math.abs(this.childSaldoView.monto) : Math.abs(this.childSaldoView.monto)*-1 ;

    let tipoMovLiquidacion = '';
    if (this.estadoCuenta!.punto_venta_id){
      tipoMovLiquidacion = this.estadoCuenta!.tipo_flujo!;
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

    this.movimientoService
      .getListByEstadoCuenta(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        etapa,
        this.estadoCuenta!.punto_venta_id,
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

    if (listar_efectivo_insumo === 'INSUMO' && !this.tipo_insumo.value ) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    this.getList();
  }

  filtrarMovimientosPDV2(filter:string):void{
    this.liquidacionMovimientoList!.clearMovimientosList();


    if (filter === 'INSUMO' && !this.tipo_insumo.value ) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    this.getList();
  }

  cargarMovimientos(movimientos: Movimiento[]):void {
    this.movimientosSelected = movimientos;
  }

}
