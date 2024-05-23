import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable} from 'rxjs';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';

@Component({
  selector: 'app-tipo-persona-by-beneficiario-dialog-field',
  templateUrl: './tipo-persona-by-beneficiario-dialog-field.component.html',
  styleUrls: ['./tipo-persona-by-beneficiario-dialog-field.component.scss']
})
export class TipoPersonaByBeneficiarioDialogFieldComponent{
  pId?: number;
  list$?: Observable<PropietarioList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'nombre',
      title: 'Beneficiario',
      value: (element: PropietarioList) => element.nombre,
    },
    {
      def: 'Nº Documento',
      title: 'Ruc',
      value: (element: PropietarioList) => element.ruc,
    },

  ];
  @Input() inputValuePropName = 'ruc';
  @Input() form!: FormGroup;
  @Input() controlName = 'ruc';
  @Input() groupName = '';
  // @Input() emptyHint =
  //   'No existen tipo persona';
  @Input() title = 'Documento';
  @Input() subtitle =
    'Si no encuentra el tipo persona';

  @Input() set tipoPersonaId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<PropietarioList>;

  constructor(private service: PropietarioService) {}

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getListByPersonaId(this.pId);
    }
  }
}
