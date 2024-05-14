import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { PropietarioService } from 'src/app/services/propietario.service';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';

@Component({
  selector: 'app-tipo-persona-by-propietario-field',
  templateUrl: './tipo-persona-by-propietario-field.component.html',
  styleUrls: ['./tipo-persona-by-propietario-field.component.scss']
})
export class TipoPersonaByPropietarioFieldComponent{
  readonly inputValuePropName = 'info';
  list$?: Observable<PropietarioList[]>;
  formGroup?: FormGroup;
  cId?: number;
  sId?: number;
  id?: number;
  tipoPersonaList: PropietarioList[] = [];
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },

    {
      def: 'propietario',
      title: 'Beneficiario',
      value: (element: PropietarioList) => element.nombre,
    },

  ];


  
  @Input() controlName = 'propietario_id';
  @Input() form!: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Beneficiario';
  @Input() set camionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  @Input() set propietarioId(id: number | undefined) {
    this.id = id;
    this.getList();
  }
  @Input() set semiId(id: number | undefined) {
    this.sId = id;
    this.getList();
  }
  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<PropietarioList | undefined>();
  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<PropietarioList>;

  constructor(private service: PropietarioService, private tipoPersonaService: TipoPersonaService) {
    this.getList();
  }

  private getList(): void {
    this.list$ = this.service.getList();
  }
    get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }
}
