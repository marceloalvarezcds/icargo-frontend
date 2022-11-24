import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { SemiService } from 'src/app/services/semi.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-semi-by-camion-producto-dialog-field',
  templateUrl: './semi-by-camion-producto-dialog-field.component.html',
  styleUrls: ['./semi-by-camion-producto-dialog-field.component.scss'],
})
export class SemiByCamionProductoDialogFieldComponent {
  readonly inputValuePropName = 'info';
  cId?: number;
  pId?: number;
  list$?: Observable<SemiList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
    },
    {
      def: 'placa',
      title: 'Placa',
      value: (element: SemiList) => element.placa,
    },
    {
      def: 'propietario_nombre',
      title: 'Propietario',
      value: (element: SemiList) => element.propietario_nombre,
    },
    {
      def: 'numero_chasis',
      title: 'Nº de Chasis',
      value: (element: SemiList) => element.numero_chasis,
    },
    {
      def: 'marca_descripcion',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'clasificacion_descripcion',
      title: 'Clasificación',
      value: (element: SemiList) => element.clasificacion_descripcion,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'semi_id';
  @Input() groupName = '';
  @Input() title = 'Semi-remolque';
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set productoId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<SemiList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<SemiList>;

  constructor(private service: SemiService) {}

  private getList(): void {
    if (this.cId && this.pId) {
      this.list$ = this.service.getListByCamionIdAndProductoId(
        this.cId,
        this.pId
      );
    }
  }
}
