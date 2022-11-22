import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-propietario-readonly-by-id-dialog-field',
  templateUrl: './propietario-readonly-by-id-dialog-field.component.html',
  styleUrls: ['./propietario-readonly-by-id-dialog-field.component.scss'],
})
export class PropietarioReadonlyByIdDialogFieldComponent {
  readonly inputValuePropName = 'info';
  cId?: number;
  id?: number;
  list: PropietarioList[] = [];
  propietario?: PropietarioList;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: PropietarioList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: PropietarioList) => element.estado,
    },
    {
      def: 'nombre',
      title: 'Nombre o Razón Social',
      value: (element: PropietarioList) => element.nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: PropietarioList) => element.direccion,
    },
    {
      def: 'telefono',
      title: 'Teléfono',
      value: (element: PropietarioList) => element.telefono,
    },
    {
      def: 'tipo_persona',
      title: 'Tipo de Persona',
      value: (element: PropietarioList) => element.tipo_persona_descripcion,
    },
    {
      def: 'ruc',
      title: 'Número de Documento',
      value: (element: PropietarioList) => element.ruc,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: PropietarioList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: PropietarioList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: PropietarioList) =>
        element.ciudad_nombre
          ? `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`
          : '',
    },
  ];

  @Input() controlName = 'propietario_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Propietario';
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set propietarioId(id: number | undefined) {
    this.id = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<PropietarioList>;

  constructor(private service: PropietarioService) {}

  private getList(): void {
    this.getPropietario();
    if (this.list.length === 0) {
      const list$ = this.cId
        ? this.service.getListByGestorCuentaByCamionId(this.cId)
        : this.service.getListByGestorCuenta();
      list$.subscribe((list) => {
        this.list = list;
        this.getPropietario();
      });
    }
  }

  private getPropietario(): void {
    this.propietario =
      this.id && this.list.length > 0
        ? this.list.find((p) => p.id === this.id)
        : undefined;
  }
}
