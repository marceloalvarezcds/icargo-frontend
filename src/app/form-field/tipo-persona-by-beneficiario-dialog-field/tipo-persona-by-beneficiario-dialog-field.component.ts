import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of} from 'rxjs';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { PropietarioService } from 'src/app/services/propietario.service';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';

@Component({
  selector: 'app-tipo-persona-by-beneficiario-dialog-field',
  templateUrl: './tipo-persona-by-beneficiario-dialog-field.component.html',
  styleUrls: ['./tipo-persona-by-beneficiario-dialog-field.component.scss']
})
export class TipoPersonaByBeneficiarioDialogFieldComponent{
  pId?: number;
  formGroup?: FormGroup;
  list$: Observable<PropietarioList[]> = new Observable();
  readonly inputValuePropName = 'ruc';

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
    return this.form.get(this.groupName) as FormGroup;
  }

  get control() {
    return this.form?.get(this.groupName)?.get(this.controlName);
  }

  @Input() persona?:PropietarioList;
  @Input() title = '';
  @Input() form!: FormGroup;
  @Input() controlName = 'propietario_id';
  @Input() controlNameRuc = 'ruc';
  @Input() groupName = '';
  @Input() isShow = false;
  @Input() emptyHint = 'No existen tipo persona';
  @Input() subtitle = 'Si no encuentra el tipo persona';

  @Input() set tipoPersonaId(id: number | undefined) {
    if (id && id !== this.pId) {
      this.pId = id;
      //this.getList();
    }
  }

  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();
  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<PropietarioList>;

  fetchFunction = () => {
    if (this.pId) return this.service.getListByPersonaId(this.pId);
    else return of<PropietarioList[]>();
  }

  constructor(private service: PropietarioService) {}

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getListByPersonaId(this.pId);

      this.list$.subscribe({
        next: (data) => {
          console.log('Lista recibida:', data);
          if (!data.length) {
            console.warn('La lista está vacía.');
          }
        },
        error: (err) => console.error('Error al obtener la lista:', err),
      });
    }
  }

  resetRucField(): void {
    this.control?.reset();
  }
}
