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

  @Input() hideOperacion = false;

  @Input() title = 'Saldo | Valor de la operación';

  @Output() saldoChange = new EventEmitter<number>();

  get saldo(): number {
    const saldo = subtract(this.credito, this.debito);
    this.saldoChange.emit(saldo);
    return saldo;
  }
}
