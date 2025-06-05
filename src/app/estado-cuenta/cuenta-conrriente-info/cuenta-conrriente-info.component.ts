import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Moneda } from 'src/app/interfaces/moneda';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-cuenta-conrriente-info',
  templateUrl: './cuenta-conrriente-info.component.html',
  styleUrls: ['./cuenta-conrriente-info.component.scss']
})
export class CuentaConrrienteInfoComponent {

  @Input() es_pdv?: boolean = false;
  @Input() estadoCuenta?: EstadoCuenta;
  @Input() esEditableLinea=false;
  @Input() form!:FormGroup;
  @Input() esInsumoControl:FormControl|undefined=undefined;
  @Input() tipo_insumo:FormControl|undefined=undefined;
  @Input() esFinalizado = false;
  @Input() esOrdenPago = false;
  @Input() showResumen = false;
  @Input() credito = 0;
  @Input() debito = 0;
  @Input() saldoCC : number = 0;
  @Input() esEdicion = false;
  @Input() liquidacion: Liquidacion | undefined;

  @Output() filterEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() monedaSelect: EventEmitter<Moneda> = new EventEmitter<Moneda>();

  get saldo(): number {
    let calcSaldo = 0;
    let totalOp = 0;
    let sentido = '';

    totalOp = subtract(this.credito, this.debito);

    if (this.esEdicion) calcSaldo = this.saldoCC ;
    else calcSaldo = this.saldoCC + totalOp ;

    if (totalOp < 0){
      // es cobro
      sentido = 'C';
    } else if (totalOp >= 0) {
      // es pago
      sentido = 'P';
    }

    return (sentido==='P') ? Math.abs(calcSaldo) : Math.abs(calcSaldo)*-1;
  }

  get saldoMovimiento(): number {
    return subtract(this.credito, this.debito);
  }

  get esInsumoControlvalue(): boolean {
    return this.esInsumoControl?.value;
  }

  constructor() { }

  filtrarMovimientosPDV():void {
    const listar_efectivo_insumo = this.esInsumoControlvalue ? "EFECTIVO" : "INSUMO";
    this.filterEvent.emit(listar_efectivo_insumo);
  }

}
