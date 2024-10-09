import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { subtract } from 'src/app/utils/math';
import { OperacionComponent } from '../operacion/operacion.component';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss'],
})
export class SaldoComponent {

  @Input() showIngresoEgreso = true;

  @Input() showResumen = false;

  @Input() showInstrumentos = false;

  @Input() credito = 0;

  @Input() debito = 0;

  @Input() valorInstrumentos = 0;

  @Input() residuo = 0;

  @Input() esFinalizado = false;

  @Input() hideOperacion = false;

  @Input() title = 'Saldo | Valor de la operación';

  @Output() saldoChange = new EventEmitter<number>();

  @Input() monto = 0;

  @Input() showMonto = false;

  @Input() saldoCC = 0;

  @Input() esEdicion = false;

  get saldo(): number {
    let calcSaldo = 0;
    let totalOp = 0;
    let sentido = '';

    totalOp = subtract(this.credito, this.debito);

    if (this.esEdicion) calcSaldo = this.saldoCC - totalOp;
    else calcSaldo = totalOp + this.saldoCC;

    if (calcSaldo < 0){
      // es cobro
      sentido = 'C';
    } else if (calcSaldo >= 0) {
      // es pago
      sentido = 'P';
    }

    if (Math.abs(this.monto) > Math.abs(totalOp)){
      calcSaldo = Math.abs(totalOp) - Math.abs(this.monto) + calcSaldo;
      //calcSaldo = subtract(Math.abs(calcSaldo), Math.abs(calcSaldo));
    } else if (Math.abs(this.monto) < Math.abs(totalOp)){
      calcSaldo = subtract(Math.abs(totalOp), Math.abs(this.monto)) + calcSaldo;
      //calcSaldo = subtract(Math.abs(calcSaldo), Math.abs(this.monto));
    } //else {
      //calcSaldo = 0;
    //}
    //calcSaldo = calcSaldo + this.saldoCC;
    return (sentido==='P') ? Math.abs(calcSaldo) : Math.abs(calcSaldo)*-1;
    //return calcSaldo;
  }

  get saldoMovimiento(): number {
    return subtract(this.credito, this.debito);
  }

}
