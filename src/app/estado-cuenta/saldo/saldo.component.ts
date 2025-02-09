import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { subtract } from 'src/app/utils/math';

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

  @Input() saldoFinalizado : number | undefined = undefined;

  @Input() hideOperacion = false;

  @Input() title = 'Saldo | Valor de la operación';

  @Output() saldoChange = new EventEmitter<number>();

  @Input() monto = 0;

  @Input() showMonto = false;

  @Input() saldoCC : number = 0;

  @Input() esEdicion = false;

  @Input() form?:FormGroup;

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


}
