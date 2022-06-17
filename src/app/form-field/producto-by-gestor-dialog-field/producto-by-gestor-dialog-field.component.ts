import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { Producto } from 'src/app/interfaces/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-producto-by-gestor-dialog-field',
  templateUrl: './producto-by-gestor-dialog-field.component.html',
  styleUrls: ['./producto-by-gestor-dialog-field.component.scss'],
})
export class ProductoByGestorDialogFieldComponent {
  readonly inputValuePropName = 'descripcion';
  list: Producto[] = [];
  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: Producto) => element.id,
    },
    {
      def: 'descripcion',
      title: 'Nombre',
      value: (element: Producto) => element.descripcion,
    },
    {
      def: 'tipo_carga_descripcion',
      title: 'Moneda',
      value: (element: Producto) => element.tipo_carga_descripcion,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Producto) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: Producto) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: Producto) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: Producto) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: Producto) => element.modified_at,
      type: 'date',
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'producto_id';
  @Input() groupName = '';
  @Input() title = 'Producto';

  @Output() valueChange = new EventEmitter<Producto>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<Producto>;

  constructor(private service: ProductoService) {}
}
