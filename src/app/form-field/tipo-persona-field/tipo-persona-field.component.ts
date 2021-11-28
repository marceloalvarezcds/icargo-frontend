import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TipoPersona } from 'src/app/interfaces/tipo-persona';
import { TipoPersonaService } from 'src/app/services/tipo-persona.service';
import { isFisica } from 'src/app/utils/tipo-persona';

@Component({
  selector: 'app-tipo-persona-field',
  templateUrl: './tipo-persona-field.component.html',
  styleUrls: ['./tipo-persona-field.component.scss']
})
export class TipoPersonaFieldComponent implements OnDestroy {

  formGroup?: FormGroup;
  controlSubscription?: Subscription;
  tipoPersonaList: TipoPersona[] = [];
  tipoPersonaSubscription = this.tipoPersonaService.getList().subscribe(list => {
    this.tipoPersonaList = list.slice();
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

  constructor(private tipoPersonaService: TipoPersonaService) { }

  ngOnDestroy(): void {
    this.controlSubscription?.unsubscribe();
    this.tipoPersonaSubscription.unsubscribe();
  }
}
