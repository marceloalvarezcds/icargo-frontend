import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from 'src/app/interfaces/column';
import { ContraparteGralInfo, ContraparteInfo } from 'src/app/interfaces/contraparte-info';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-liquidacion-confirm-dialog',
  templateUrl: './liquidacion-confirm-dialog.component.html',
  styleUrls: ['./liquidacion-confirm-dialog.component.scss'],
})
export class LiquidacionConfirmDialogComponent {
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID Mov.',
      value: (element: Movimiento) => element.id,
    },
    /*{
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.concepto,
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
    },*/
    {
      def: 'detalle',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalle,
    },
    {
      def: 'tipo_documento_relacionado_descripcion',
      title: 'Tipo de Doc Relacionado',
      value: (element: Movimiento) =>
        element.tipo_documento_relacionado_descripcion,
    },
    {
      def: 'numero_documento_relacionado',
      title: 'Nº Doc Relacionado',
      value: (element: Movimiento) => element.numero_documento_relacionado,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Movimiento) => element.moneda_nombre,
    },
    {
      def: 'tipo_cambio_moneda',
      title: 'Cambio',
      value: (element: Movimiento) => element.tipo_cambio_moneda,
      type: 'number',
    },
    /*{
      def: 'fecha_cambio_moneda',
      title: 'Fecha de cambio',
      value: (element: Movimiento) => element.fecha_cambio_moneda,
      type: 'date',
    },*/
    {
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_mon_local,
      type: 'number',
    },
    /*{
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Movimiento) => element.created_at,
      type: 'date',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Movimiento) => element.created_by,
    },*/
  ];

  get contraparteInfo(): ContraparteGralInfo {
    return this.data.contraparteInfo;
  }

  get list(): Movimiento[] {
    return this.data.list;
  }

  get credito(): number {
    return this.data.credito;
  }

  get debito(): number {
    return this.data.debito;
  }

  get monto(): number {
    return this.data.monto;
  }

  get saldo(): number {
    return this.data.saldo;
  }

  get esOrdenPago():boolean {
    return this.data.esOrdenPago ?? false;
  }

  get totalMonedas() {
    return this.data.totalMonedas;
  }

  constructor(
    public dialogRef: MatDialogRef<LiquidacionConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: LiquidacionConfirmDialogData
  ) {}
}
