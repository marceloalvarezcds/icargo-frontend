import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class TipoPersonaFieldComponent implements OnInit, OnDestroy {
  formGroup?: FormGroup;
  tipoPersonaList: TipoPersona[] = [];
  tipoPersonaSubscription?: Subscription;

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.setupControlSubscription();
  }

  @Input() controlName = 'tipo_persona_id';
  @Input() groupName = '';
  @Input() title = '';
  @Input() requerido = false;

  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<TipoPersona | undefined>();

  constructor(private tipoPersonaService: TipoPersonaService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.tipoPersonaSubscription = this.tipoPersonaService.getList().subscribe(list => {
      this.tipoPersonaList = list.slice();
    });
  }

  ngOnDestroy(): void {
    this.tipoPersonaSubscription?.unsubscribe();
  }

  private setupControlSubscription(): void {
    if (this.formGroup) {
      const control = this.formGroup.get(this.groupName)?.get(this.controlName);
      control?.valueChanges.pipe(filter(v => !!v)).subscribe(id => {
        const tipoPersona = this.tipoPersonaList.find(x => x.id === id);
        this.valueChange.emit(tipoPersona);
        this.isFisicaSelected.emit(isFisica(this.tipoPersonaList, id));
      });
    }
  }

  get control(): FormControl {
    return this.formGroup!.get(this.groupName) as FormControl;
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }
}

