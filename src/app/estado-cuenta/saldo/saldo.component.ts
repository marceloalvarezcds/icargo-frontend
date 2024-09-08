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

  @Output() montoChange: EventEmitter<number> = new EventEmitter<number>();

  get saldo(): number {
    let saldo = 0;
    
    if (this.monto>0) saldo = subtract(this.monto,subtract(this.credito, this.debito));
    else saldo = subtract(this.credito, this.debito);

    this.saldoChange.emit(saldo);
    return saldo;
  }

  montoChangeEvt(event:any) :any{
    this.montoChange.emit(this.monto);
  }

}
