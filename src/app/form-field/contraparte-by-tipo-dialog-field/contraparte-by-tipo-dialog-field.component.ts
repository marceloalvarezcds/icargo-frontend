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
import { ContraparteWithId } from 'src/app/interfaces/contraparte-info';
import { ContraparteService } from 'src/app/services/contraparte.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-contraparte-by-tipo-dialog-field',
  templateUrl: './contraparte-by-tipo-dialog-field.component.html',
  styleUrls: ['./contraparte-by-tipo-dialog-field.component.scss'],
})
export class ContraparteByTipoDialogFieldComponent {
  readonly inputValuePropName = 'info';
  tipoId?: number;
  list$?: Observable<ContraparteWithId[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: ContraparteWithId) => element.id,
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: ContraparteWithId) => element.contraparte,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Doc Contraparte',
      value: (element: ContraparteWithId) =>
        element.contraparte_numero_documento,
    },
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo de Contraparte',
      value: (element: ContraparteWithId) =>
        element.tipo_contraparte_descripcion,
    },
  ];

  @Input() form?: FormGroup;
  @Input() controlName = 'contraparte_id';
  @Input() groupName?: string;
  @Input() title = 'Contraparte';
  @Input() readonly = false;
  @Input() openField = false;
  @Input() set tipoContraparteId(id: number | undefined) {
    this.tipoId = id;
    this.getList();
  }

  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<ContraparteWithId | undefined>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<ContraparteWithId>;

  constructor(private service: ContraparteService) {}

  private getList(): void {
    if (this.tipoId) {
      this.list$ = this.service.getListByTipoContraparteId(this.tipoId);
    }
  }
}
