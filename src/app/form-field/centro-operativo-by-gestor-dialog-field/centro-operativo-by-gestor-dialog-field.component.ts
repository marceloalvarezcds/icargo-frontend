import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CentroOperativoList } from 'src/app/interfaces/centro-operativo';
import { Column } from 'src/app/interfaces/column';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-centro-operativo-by-gestor-dialog-field',
  templateUrl: './centro-operativo-by-gestor-dialog-field.component.html',
  styleUrls: ['./centro-operativo-by-gestor-dialog-field.component.scss'],
})
export class CentroOperativoByGestorDialogFieldComponent {
  list: CentroOperativoList[] = [];
  subs = this.service.getListByGestorCuentaId().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: CentroOperativoList) => element.id,
      sticky: true,
    },
    {
      def: 'nombre',
      title: 'Nombre',
      value: (element: CentroOperativoList) => element.nombre,
      sticky: true,
    },
    {
      def: 'nombre_corto',
      title: 'Nombre de Fantasía',
      value: (element: CentroOperativoList) => element.nombre_corto,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: CentroOperativoList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: CentroOperativoList) =>
        `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`,
    },
    {
      def: 'categoria',
      title: 'Clasificación',
      value: (element: CentroOperativoList) => element.clasificacion_nombre,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'flete_id';
  @Input() groupName = '';
  @Input() title = 'Centro operativo';

  @Output() valueChange = new EventEmitter<CentroOperativoList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<CentroOperativoList>;

  constructor(private service: CentroOperativoService) {}

  inputValueFormat(value: CentroOperativoList | undefined): string {
    return value ? value.nombre : '';
  }
}
