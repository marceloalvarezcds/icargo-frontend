import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';
import { PropietarioService } from 'src/app/services/propietario.service';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { isFisica } from 'src/app/utils/tipo-persona';
@Component({
  selector: 'app-tipo-persona-by-propietario-field',
  templateUrl: './tipo-persona-by-propietario-field.component.html',
  styleUrls: ['./tipo-persona-by-propietario-field.component.scss']
})
export class TipoPersonaByPropietarioFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  controlSubscription?: Subscription;
  tipoPersonaList: TipoPersona[] = [];
  tipoPersonaSubscription = this.tipoPersonaService.getList().subscribe(list => {
    this.tipoPersonaList = list.slice();
    this.cdRef.detectChanges();
  });

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.controlSubscription = this.control.valueChanges.pipe(filter(v => !!v)).subscribe(id => {
      this.isFisicaSelected.emit(isFisica(this.tipoPersonaList, id));
    });
  }
  @Input() controlName = 'tipo_persona_id';
  @Input() groupName = '';
  @Input() title = 'Tipo de Persona';

  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<TipoPersona | undefined>();

  constructor(private tipoPersonaService: TipoPersonaService, private cdRef: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
    this.tipoPersonaSubscription.unsubscribe();
  }
}