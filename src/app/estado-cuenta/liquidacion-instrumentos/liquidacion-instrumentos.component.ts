import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InstrumentoFormDialogComponent } from 'src/app/dialogs/instrumento-form-dialog/instrumento-form-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento, InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { InstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

@Component({
  selector: 'app-liquidacion-instrumentos',
  templateUrl: './liquidacion-instrumentos.component.html',
  styleUrls: ['./liquidacion-instrumentos.component.scss'],
})
export class LiquidacionInstrumentosComponent {
  a = a;
  m = m;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: Instrumento) => element.id,
      sticky: true,
    },
    {
      def: 'via_descripcion',
      title: 'Vía',
      value: (element: Instrumento) => element.via_descripcion,
    },
    {
      def: 'cuenta_descripcion',
      title: 'Caja/Banco',
      value: (element: Instrumento) => element.cuenta_descripcion,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      value: (element: Instrumento) => element.fecha_instrumento,
      type: 'only-date',
    },
    {
      def: 'tipo_instrumento_descripcion',
      title: 'Tipo de instrumento',
      value: (element: Instrumento) => element.tipo_instrumento_descripcion,
    },
    {
      def: 'operacion_estado',
      title: 'Estado',
      value: (element: Instrumento) => element.operacion_estado,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Instrumento) => element.monto,
      type: 'number',
    },
    {
      def: 'provision_rechazada',
      title: 'Monto rechazado',
      value: (element: Instrumento) => element.provision_rechazada,
      type: 'number',
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'cheque_es_diferido',
      title: 'Es cheque diferido',
      value: (element: Instrumento) =>
        element.cheque_es_diferido ? 'Si' : 'No',
    },
    {
      def: 'cheque_fecha_vencimiento',
      title: 'Fecha de vencimiento del cheque',
      value: (element: Instrumento) => element.cheque_fecha_vencimiento,
      type: 'only-date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  @Input() isShow: boolean = false;
  @Input() list: Instrumento[] = [];
  @Input() liquidacion : any;

  constructor(
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {}

  get gestorCargaId(): number | undefined {
    return this.liquidacion.gestor_carga_id;
  }


  show({ row, index }: TableEvent<Instrumento>): void {

    let istrumentoItem : any = {};

    istrumentoItem=Object.assign(istrumentoItem, row);
    istrumentoItem.numero_documento = row.contraparte_numero_documento;

    edit(this.getDialogRef(istrumentoItem), (item: Instrumento) => {
      const list = this.list.slice();
      list[index] = item;
      this.list = list;
    });
  }

  private getDialogRef(
    item?: InstrumentoLiquidacionItem
  ): MatDialogRef<InstrumentoFormDialogComponent, InstrumentoLiquidacionItem> {
    const data: InstrumentoFormDialogData = {
      es_cobro: this.liquidacion?.es_cobro ?? false,
      residuo: item?.monto!,
      item,
      isShow:true,
      totalMonedas: []
    };
    return this.dialog.open(InstrumentoFormDialogComponent, {
      data,
      panelClass: 'half-dialog',
    });
  }

}
