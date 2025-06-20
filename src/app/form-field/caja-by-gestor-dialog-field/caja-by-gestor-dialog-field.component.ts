import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Caja } from 'src/app/interfaces/caja';
import { Column } from 'src/app/interfaces/column';
import { CajaService } from 'src/app/services/caja.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-caja-by-gestor-dialog-field',
  templateUrl: './caja-by-gestor-dialog-field.component.html',
  styleUrls: ['./caja-by-gestor-dialog-field.component.scss'],
})
export class CajaByGestorDialogFieldComponent {
  readonly inputValuePropName = 'nombre';
  list: Caja[] = [];
  // subs = this.cajaService.getListByGestorCarga().subscribe((list) => {
  //   this.list = list;
  // });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Caja) => element.id,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: Caja) => element.nombre,
    },
    {
      def: 'moneda_nombre',
      title: 'Moneda',
      value: (element: Caja) => element.moneda_nombre,
    },
    {
      def: 'credito',
      title: 'Crédito',
      value: (element: Caja) => element.credito,
      type: 'number'
    },
    {
      def: 'debito',
      title: 'Débito',
      value: (element: Caja) => element.debito,
      type: 'number'
    },
    {
      def: 'saldo_confirmado',
      title: 'Saldo',
      value: (element: Caja) => element.saldo_confirmado,
      type: 'number'
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Caja) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Caja) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Caja) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Caja) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Caja) => element.modified_at,
      type: 'date',
    },
  ];

  @Input() cajaEvents?: Observable<Caja>
  @Input() form!: FormGroup;
  @Input() controlName = 'caja_id';
  @Input() groupName = '';
  @Input() title = 'Caja';

  @Output() valueChange = new EventEmitter<Caja>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<Caja>;

  fetchFunction = () => this.cajaService.getListByGestorCarga();

  constructor(private cajaService: CajaService) {}
}
