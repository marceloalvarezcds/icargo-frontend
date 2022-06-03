import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html',
  styleUrls: ['./operacion.component.scss'],
})
export class OperacionComponent {
  @Input() saldo = 0;

  get esCobro(): boolean {
    return this.saldo < 0;
  }

  get esPago(): boolean {
    return this.saldo > 0;
  }

  get operacion(): string {
    return this.esCobro ? 'A Cobrar' : this.esPago ? 'A Pagar' : '';
  }
}
