import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flete-form-merma',
  templateUrl: './flete-form-merma.component.html',
  styleUrls: ['./flete-form-merma.component.scss'],
})
export class FleteFormMermaComponent implements OnDestroy {
  formGroup?: FormGroup;
  groupName = 'merma';
  esPorcentualSubscription?: Subscription;

  @Input() afectado = 'gestor_carga';
  @Input() afectadoTitle = 'Gestor';
  @Input() isShow = false;
  @Input() set form(f: FormGroup) {
    this.formGroup = f;
    this.esPorcentualSubscription =
      this.esPorcentualControl.valueChanges.subscribe((val) => {
        if (val) {
          this.toleranciaControl.setValidators(Validators.max(100));
        } else {
          this.toleranciaControl.removeValidators(Validators.max(100));
        }
        this.toleranciaControl.updateValueAndValidity();
      });
  }

  get group(): FormGroup {
    return this.formGroup!.get(this.groupName) as FormGroup;
  }

  get toleranciaControl(): FormControl {
    return this.group.controls[
      `merma_${this.afectado}_tolerancia`
    ] as FormControl;
  }

  get esPorcentualControl(): FormControl {
    return this.group.controls[
      `merma_${this.afectado}_es_porcentual`
    ] as FormControl;
  }

  get esPorcentual(): boolean {
    return !!this.esPorcentualControl.value;
  }

  ngOnDestroy(): void {
    this.esPorcentualSubscription?.unsubscribe();
  }
}
