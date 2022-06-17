import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-semi-by-gestor-dialog-field',
  templateUrl: './semi-by-gestor-dialog-field.component.html',
  styleUrls: ['./semi-by-gestor-dialog-field.component.scss'],
})
export class SemiByGestorDialogFieldComponent {
  readonly inputValuePropName = 'info';
  list: SemiList[] = [];
  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
      sticky: true,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: SemiList) => element.placa,
      sticky: true,
    },
    {
      def: 'pais_emisor_placa',
      title: 'País Emisor de la Placa',
      value: (element: SemiList) => element.pais_emisor_placa_nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: SemiList) =>
        `${element.propietario_nombre} - ${element.propietario_ruc}`,
    },
    {
      def: 'clasificacion',
      title: 'Clasificación',
      value: (element: SemiList) => element.clasificacion_descripcion,
    },
    {
      def: 'tipo',
      title: 'Tipo de Semi',
      value: (element: SemiList) => element.tipo_descripcion,
    },
    {
      def: 'tipo_carga',
      title: 'Tipo de Carga',
      value: (element: SemiList) => element.tipo_carga_descripcion,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: SemiList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: SemiList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: SemiList) => element.estado,
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: SemiList) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: SemiList) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: SemiList) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: SemiList) => element.modified_at,
      type: 'date',
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'semi_id';
  @Input() groupName = '';
  @Input() title = 'Semi';

  @Output() valueChange = new EventEmitter<SemiList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<SemiList>;

  constructor(private service: SemiService) {}
}
