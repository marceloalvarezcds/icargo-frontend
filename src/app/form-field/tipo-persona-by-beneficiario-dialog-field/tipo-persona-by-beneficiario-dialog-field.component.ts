import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  formGroup?: FormGroup;
  list$?: Observable<PropietarioList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: PropietarioList) => element.estado,
    },
    {
      def: 'nombre',
      title: 'Beneficiario',
      value: (element: PropietarioList) => element.nombre,
    },
    {
      def: 'ruc',
      title: 'Nº Documento',
      value: (element: PropietarioList) => element.ruc,
    },

  ];

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }
  
  get control() {
    return this.form.get(this.groupName)?.get(this.controlName);
  }

  resetRucField(): void {
    if (this.control) {
      this.control.reset(); // Restablecer el valor del campo RUC
    }
  }
  
  @Input() inputValuePropName = 'ruc';
  @Input() form!: FormGroup;
  @Input() controlName = 'ruc';
  @Input() groupName = '';
  @Input() emptyHint =
     'No existen tipo persona';
  @Input() title = 'Nº Doc.';
  @Input() subtitle =
    'Si no encuentra el tipo persona';

  @Input() set tipoPersonaId(id: number | undefined) {
    this.pId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();
  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<PropietarioList>;

  constructor(private service: PropietarioService) {}

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getListByPersonaId(this.pId);
    }
  }
}
