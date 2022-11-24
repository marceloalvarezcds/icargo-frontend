import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChoferList } from 'src/app/interfaces/chofer';
import { Column } from 'src/app/interfaces/column';
import { ChoferService } from 'src/app/services/chofer.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-chofer-by-camion-dialog-field',
  templateUrl: './chofer-by-camion-dialog-field.component.html',
  styleUrls: ['./chofer-by-camion-dialog-field.component.scss'],
})
export class ChoferByCamionDialogFieldComponent {
  readonly inputValuePropName = 'info';
  cId?: number;
  list$?: Observable<ChoferList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: ChoferList) => element.id,
    },
    {
      def: 'nombre',
      title: 'Nombre o Razón Social',
      value: (element: ChoferList) => element.nombre,
    },
    {
      def: 'tipo_documento',
      title: 'Tipo de Documento',
      value: (element: ChoferList) => element.tipo_documento_descripcion,
    },
    {
      def: 'pais_emisor_documento',
      title: 'País Emisor del Documento',
      value: (element: ChoferList) => element.pais_emisor_documento_nombre,
    },
    {
      def: 'numero_documento',
      title: 'Número de Documento',
      value: (element: ChoferList) => element.numero_documento,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: ChoferList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: ChoferList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: ChoferList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: ChoferList) =>
        element.ciudad_nombre
          ? `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`
          : '',
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: ChoferList) => element.estado,
    },
  ];

  @Input() controlName = 'chofer_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Chofer';
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<ChoferList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<ChoferList>;

  constructor(private service: ChoferService) {}

  private getList(): void {
    this.list$ = this.cId
      ? this.service.getListByWithoutCamionByCamionId(this.cId)
      : this.service.getListByWithoutCamion();
  }
}
