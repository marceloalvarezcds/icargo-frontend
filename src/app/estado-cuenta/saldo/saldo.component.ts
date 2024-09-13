import { Component, Input, Output, EventEmitter } from '@angular/core';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss'],
})
export class SaldoComponent {
  @Input() credito = 0;

  @Input() debito = 0;

  @Input() esFinalizado = false;

  @Input() hideOperacion = false;

  @Input() title = 'Saldo | Valor de la operación';

  @Output() saldoChange = new EventEmitter<number>();

  @Input() monto = 0;

  @Input() showMonto = false;

  get saldo(): number {
    let calcSaldo = 0;
    let sentido = '';

    calcSaldo = subtract(this.credito, this.debito);

    if (calcSaldo < 0){
      // es cobro
      sentido = 'C';
    } else if (calcSaldo > 0) {
      // es pago
      sentido = 'P';
    }

    if (this.monto > Math.abs(calcSaldo)){
      calcSaldo = subtract(this.monto, Math.abs(calcSaldo));
    }

    if (this.monto < Math.abs(calcSaldo)){
      calcSaldo = subtract(Math.abs(calcSaldo), this.monto);
    }

    return (sentido==='P') ? Math.abs(calcSaldo) : Math.abs(calcSaldo)*-1;

  }

}
