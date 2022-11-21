import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { TipoMovimiento } from 'src/app/interfaces/tipo-movimiento';
import { TipoMovimientoService } from 'src/app/services/tipo-movimiento.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-tipo-movimiento-dialog-field',
  templateUrl: './tipo-movimiento-dialog-field.component.html',
  styleUrls: ['./tipo-movimiento-dialog-field.component.scss'],
})
export class TipoMovimientoDialogFieldComponent {
  readonly inputValuePropName = 'info';
  list: TipoMovimiento[] = [];
  subs = this.service.getActiveList().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: TipoMovimiento) => element.id,
      sticky: true,
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: TipoMovimiento) => element.cuenta_codigo_descripcion,
    },
    {
      def: 'codigo_descripcion',
      title: 'Concepto',
      value: (element: TipoMovimiento) => element.codigo_descripcion,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: TipoMovimiento) => element.created_at,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'tipo_movimiento_id';
  @Input() groupName = '';
  @Input() title = 'Tipo de Movimiento';

  @Output() valueChange = new EventEmitter<TipoMovimiento | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<TipoMovimiento>;

  constructor(private service: TipoMovimientoService) {}
}
