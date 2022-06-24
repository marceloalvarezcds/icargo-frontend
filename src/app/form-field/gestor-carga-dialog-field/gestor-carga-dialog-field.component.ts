import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { GestorCargaList } from 'src/app/interfaces/gestor-carga';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-gestor-carga-dialog-field',
  templateUrl: './gestor-carga-dialog-field.component.html',
  styleUrls: ['./gestor-carga-dialog-field.component.scss'],
})
export class GestorCargaDialogFieldComponent {
  readonly inputValuePropName = 'nombre';
  list: GestorCargaList[] = [];
  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: GestorCargaList) => element.id,
      sticky: true,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: GestorCargaList) => element.nombre,
      sticky: true,
    },
    {
      def: 'nombre_corto',
      title: 'Nombre de Fantasía',
      value: (element: GestorCargaList) => element.nombre_corto,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: GestorCargaList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: GestorCargaList) =>
        `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'gestor_carga_id';
  @Input() groupName = '';
  @Input() title = 'Gestor de carga';

  @Output() valueChange = new EventEmitter<GestorCargaList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<GestorCargaList>;

  constructor(private service: GestorCargaService) {}
}
