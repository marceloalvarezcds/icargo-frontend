import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { Banco } from 'src/app/interfaces/banco';
import { Column } from 'src/app/interfaces/column';
import { BancoService } from 'src/app/services/banco.service';

@Component({
  selector: 'app-banco-by-gestor-dialog-field',
  templateUrl: './banco-by-gestor-dialog-field.component.html',
  styleUrls: ['./banco-by-gestor-dialog-field.component.scss'],
})
export class BancoByGestorDialogFieldComponent {
  readonly inputValuePropName = 'info';
  list: Banco[] = [];
  subs = this.bancoService.getListByGestorCarga().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Banco) => element.id,
    },
    {
      def: 'numero_cuenta',
      title: 'Nº de Cuenta',
      value: (element: Banco) => element.numero_cuenta,
    },
    {
      def: 'titular',
      title: 'Titular',
      value: (element: Banco) => element.titular,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: Banco) => element.nombre,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Banco) => element.moneda_nombre,
    },
    {
      def: 'credito',
      title: 'Crédito',
      value: (element: Banco) => element.credito,
    },
    {
      def: 'debito',
      title: 'Débito',
      value: (element: Banco) => element.debito,
    },
    {
      def: 'saldo_confirmado',
      title: 'Saldo',
      value: (element: Banco) => element.saldo_confirmado,
    },
    {
      def: 'saldo_provisional',
      title: 'Saldo Provisional',
      value: (element: Banco) => element.saldo_provisional,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Banco) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Banco) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Banco) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Banco) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Banco) => element.modified_at,
      type: 'date',
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'banco_id';
  @Input() groupName = '';
  @Input() title = 'Banco';

  @Output() valueChange = new EventEmitter<Banco>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<Banco>;

  constructor(private bancoService: BancoService) {}
}
