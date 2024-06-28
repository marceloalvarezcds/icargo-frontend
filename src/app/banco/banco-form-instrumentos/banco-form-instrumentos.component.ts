import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperacionEstadoEnum } from 'src/app/enums/operacion-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { DialogService } from 'src/app/services/dialog.service';
import { InstrumentoService } from 'src/app/services/instrumento.service';

@Component({
  selector: 'app-banco-form-instrumentos',
  templateUrl: './banco-form-instrumentos.component.html',
  styleUrls: ['./banco-form-instrumentos.component.scss'],
})
export class BancoFormInstrumentosComponent {
  a = a;
  m = m;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Instrumento) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Instrumento) => element.operacion_estado.toUpperCase(),
    },
    {
      def: 'numero_referencia',
      title: 'Referencia',
      value: (element: Instrumento) => element.numero_referencia,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: Instrumento) => element.created_by,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      value: (element: Instrumento) => this.formatDate(element.fecha_instrumento),
    },
    {
      def: 'id_liq',
      title: 'ID liq.',
      value: (element: Instrumento) => element.liquidacion_id,
    },
    {
      def: 'tipo_operacion_descripcion',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'vencimiento',
      title: 'Vencimiento',
      value: (element: Instrumento) => element.cheque_fecha_vencimiento ? this.formatDate(element.cheque_fecha_vencimiento) : '',

    },
    {
      def: 'credito_inst_banco',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito_inst_banco',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'pendiente_inst_banco',
      title: 'Pendiente',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_inst_banco',
      title: 'Saldo',
      value: (element: Instrumento) => element.saldo_provisional,
      type: 'number',
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: Instrumento) => element.contraparte,
    },
    // {
    //   def: 'saldo_confirmado',
    //   title: 'Saldo confirmado',
    //   value: (element: Instrumento) => element.saldo_confirmado,
    //   type: 'number',
    // },
    // {
    //   def: 'provision',
    //   title: 'Provisión',
    //   value: (element: Instrumento) => element.provision,
    //   type: 'number',
    // },
    // {
    //   def: 'saldo_provisional',
    //   title: 'Saldo provisional',
    //   value: (element: Instrumento) => element.saldo_provisional,
    //   type: 'number',
    // },
    // {
    //   def: 'provision_rechazada',
    //   title: 'Provisión Rechazada',
    //   value: (element: Instrumento) => element.provision_rechazada,
    //   type: 'number',
    // },

    // {
    //   def: 'cheque_es_diferido',
    //   title: 'Es cheque diferido',
    //   value: (element: Instrumento) =>
    //     element.cheque_es_diferido ? 'Si' : 'No',
    // },
    // {
    //   def: 'cheque_fecha_vencimiento',
    //   title: 'Fecha de vencimiento del cheque',
    //   value: (element: Instrumento) => element.cheque_fecha_vencimiento,
    //   type: 'date',
    // },
    {
      def: 'confirmar',
      title: '',
      type: 'button',
      value: () => 'Confirmar',
      isDisable: (i: Instrumento) =>
        i.operacion_estado !== OperacionEstadoEnum.EMITIDO,
      buttonCallback: (element: Instrumento) => this.confirmar(element),
      stickyEnd: true,
    },
    {
      def: 'rechazar',
      title: '',
      type: 'button',
      value: () => 'Rechazar',
      isDisable: (i: Instrumento) =>
        i.operacion_estado !== OperacionEstadoEnum.EMITIDO,
      buttonCallback: (element: Instrumento) => this.rechazar(element),
      stickyEnd: true,
    },
  ];

  @Input() list: Instrumento[] = [];
  @Output() instrumentosChange = new EventEmitter();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  constructor(
    private dialog: DialogService,
    private instrumentoService: InstrumentoService
  ) {}

  private confirmar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `¿Está seguro que desea Confirmar el instrumento Nº ${id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.instrumentoService.confirmar(id),
      () => {
        this.instrumentosChange.emit();
      }
    );
  }

  private rechazar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `¿Está seguro que desea Rechazar el instrumento Nº ${id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.instrumentoService.rechazar(id),
      () => {
        this.instrumentosChange.emit();
      }
    );
  }
}
