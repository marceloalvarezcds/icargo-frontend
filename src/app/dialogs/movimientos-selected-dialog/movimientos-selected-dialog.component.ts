import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContraparteInfo } from 'src/app/interfaces/contraparte-info';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientosSelectedDialogData } from 'src/app/interfaces/movimientos-selected-dialog';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-movimientos-selected-dialog',
  templateUrl: './movimientos-selected-dialog.component.html',
  styleUrls: ['./movimientos-selected-dialog.component.scss'],
})
export class MovimientosSelectedDialogComponent {
  movimientosSelected: Movimiento[] = [];

  get contraparteInfo(): ContraparteInfo {
    return this.data.contraparteInfo;
  }

  get list(): Movimiento[] {
    return this.data.list;
  }

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get saldo(): number {
    return subtract(this.credito, this.debito);
  }

  get saldoFinal(): number {
    return this.data.saldo + this.saldo;
  }

  constructor(
    public dialogRef: MatDialogRef<MovimientosSelectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: MovimientosSelectedDialogData
  ) {}
}
