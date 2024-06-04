import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { CamionService } from 'src/app/services/camion.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-camion-by-producto-dialog-field',
  templateUrl: './camion-by-producto-dialog-field.component.html',
  styleUrls: ['./camion-by-producto-dialog-field.component.scss'],
})
export class CamionByProductoDialogFieldComponent {
  readonly inputValuePropName = 'info';
  pId?: number;
  list$?: Observable<CamionList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: CamionList) => element.id,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: CamionList) => element.placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: CamionList) => element.propietario_nombre,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: CamionList) => element.chofer_nombre,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: CamionList) => element.marca_descripcion,
    },
    {
      def: 'color_descripcion',
      title: 'Color',
      value: (element: CamionList) => element.color_descripcion,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'camion_id';
  @Input() groupName = '';
  @Input() emptyHint =
    'No existen tractos. Debe crearlos/activarlos, asignarles un chofer, activar el chofer asignado o crear una combinación';
  @Input() title = 'Tracto';
  @Input() subtitle =
    'Si no encuentra al tracto deseado se debe a que este no está activo o no tiene chofer asignado o el chofer no está activo';
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<CamionList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<CamionList>;

  constructor(private service: CamionService) {}

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getListByProductoId(this.pId);
    }
  }
}
