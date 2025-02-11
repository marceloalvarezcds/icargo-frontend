import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ComposicionJuridica } from 'src/app/interfaces/composicion-juridica';
import { ComposicionJuridicaService } from 'src/app/services/composicion-juridica.service';
import { isFisica } from 'src/app/utils/composicion-juridica';


@Component({
  selector: 'app-composicion-juridica-field',
  templateUrl: './composicion-juridica-field.component.html',
  styleUrls: ['./composicion-juridica-field.component.scss']
})
export class ComposicionJuridicaFieldComponent implements OnInit, OnDestroy {

  formGroup?: FormGroup;
  composicionJuridicaList: ComposicionJuridica[] = [];
  composicionJuridicaSubscription?: Subscription;
  composicionJuridicaChangeSubscription?: Subscription;

  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.setupControlSubscription();
  }

  @Input() controlName = 'composicion_juridica_id';
  @Input() groupName = '';
  @Input() title = '';
  @Input() requerido = false;

  @Output() isFisicaSelected = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<ComposicionJuridica | undefined>();

  constructor(private composicionJuridicaService: ComposicionJuridicaService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.composicionJuridicaSubscription = this.composicionJuridicaService.getList().subscribe(list => {

      this.composicionJuridicaList = list.slice();

      if (this.control.value){
        let a = this.control.value;
        this.control.setValue(a);
      }

    });
  }

  ngOnDestroy(): void {
    this.composicionJuridicaSubscription?.unsubscribe();
    this.composicionJuridicaChangeSubscription?.unsubscribe();
  }

  private setupControlSubscription(): void {

    if (this.formGroup) {

      this.composicionJuridicaChangeSubscription = this.control?.valueChanges.pipe(filter(v => !!v)).subscribe(id => {
        const composicionJuridica = this.composicionJuridicaList.find(x => x.id === id);
        this.valueChange.emit(composicionJuridica);
        this.isFisicaSelected.emit(isFisica(this.composicionJuridicaList, id));
      });
    }
  }

  get group(): FormGroup {
    if (this.groupName) {
      return this.formGroup?.get(this.groupName) as FormGroup;
    }
    return this.formGroup!;
  }

  get control(): FormControl {
    return this.group?.get(this.controlName) as FormControl;
  }

}

