import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
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

  subRowColumnsToDisplay: Column[] = [
    {
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => {
        let label = "";
        label = element.camion_placa ?? '';
        if ( element.tipo_movimiento_descripcion === 'Flete' ) {
          label = label + ' | Doc. Fiscal: '+ ( (element.documento_fisico_oc) ? 'Sí' : 'No') ;
        }
        return label;
      },
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
  ];

  get moneda(): string {
    return this.data.moneda ?? '';
  }

  get sentido(): string {
    return this.data.sentido ?? '';
  }

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
