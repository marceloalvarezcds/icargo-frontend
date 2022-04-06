import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OperacionEstadoEnum } from 'src/app/enums/operacion-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { InstrumentoService } from 'src/app/services/instrumento.service';
import { changeStatusConfirm } from 'src/app/utils/change-status';
import { changeStatusMessageSnackbar } from 'src/app/utils/snackbar';

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
      title: 'Nº',
      value: (element: Instrumento) => element.id,
      sticky: true,
    },
    {
      def: 'fecha_instrumento',
      title: 'Fecha',
      value: (element: Instrumento) => element.fecha_instrumento,
      type: 'date',
    },
    {
      def: 'tipo_instrumento_descripcion',
      title: 'Tipo de instrumento',
      value: (element: Instrumento) => element.tipo_instrumento_descripcion,
    },
    {
      def: 'tipo_operacion_descripcion',
      title: 'Operación',
      value: (element: Instrumento) => element.tipo_operacion_descripcion,
    },
    {
      def: 'operacion_estado',
      title: 'Estado',
      value: (element: Instrumento) => element.operacion_estado,
    },
    {
      def: 'credito',
      title: 'Crédito',
      value: (element: Instrumento) => element.credito,
      type: 'number',
    },
    {
      def: 'debito',
      title: 'Débito',
      value: (element: Instrumento) => element.debito,
      type: 'number',
    },
    {
      def: 'saldo_confirmado',
      title: 'Saldo confirmado',
      value: (element: Instrumento) => element.saldo_confirmado,
      type: 'number',
    },
    {
      def: 'provision',
      title: 'Provisión',
      value: (element: Instrumento) => element.provision,
      type: 'number',
    },
    {
      def: 'saldo_provisional',
      title: 'Saldo provisional',
      value: (element: Instrumento) => element.saldo_provisional,
      type: 'number',
    },
    {
      def: 'provision_rechazada',
      title: 'Provisión Rechazada',
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
      type: 'date',
    },
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

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private instrumentoService: InstrumentoService
  ) {}

  private confirmar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `Está seguro que desea Confirmar el instrumento Nº ${id}`;
    changeStatusConfirm(
      this.dialog,
      message,
      this.instrumentoService.confirmar(id),
      () =>
        changeStatusMessageSnackbar(this.snackbar, () =>
          this.instrumentosChange.emit()
        )
    );
  }

  private rechazar(instrumento: Instrumento): void {
    const id = instrumento.id;
    const message = `Está seguro que desea Confirmar el instrumento Nº ${id}`;
    changeStatusConfirm(
      this.dialog,
      message,
      this.instrumentoService.rechazar(id),
      () =>
        changeStatusMessageSnackbar(this.snackbar, () =>
          this.instrumentosChange.emit()
        )
    );
  }
}
