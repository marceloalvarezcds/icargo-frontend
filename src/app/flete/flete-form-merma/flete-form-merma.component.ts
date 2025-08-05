import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Moneda } from 'src/app/interfaces/moneda';
import { Unidad } from 'src/app/interfaces/unidad';

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

    /*this.group.get(`merma_${this.afectado}_moneda`)?.valueChanges.subscribe((item:any)=> {
      this.cargarSelec(item);
    });*/

    /*this.group.get(`merma_${this.afectado}_unidad`)?.valueChanges.subscribe((item:any)=> {
      this.cargarSelecUnidad(item);
    })*/

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

  cargarSelec(moneda:any):void {
    this.group.get(`merma_${this.afectado}_moneda_id`)?.setValue(moneda?.id);
    this.group.get(`merma_${this.afectado}_moneda_simbolo`)?.setValue(moneda?.simbolo);
  }

  cargarSelecUnidad(unidad:Unidad | undefined):void {
    if (!unidad) return;
    //this.group.get(`merma_${this.afectado}_unidad_id`)?.setValue(unidad?.id);
    this.group.get(`merma_${this.afectado}_unidad_abreviatura`)?.setValue(unidad?.abreviatura);
  }

  onMonedaChange(moneda: Moneda | undefined) {
    if (!moneda) return;
    //this.group.get(`merma_${this.afectado}_moneda_id`)?.setValue(moneda?.id);
    this.group.get(`merma_${this.afectado}_moneda_simbolo`)?.setValue(moneda?.simbolo);
  }

}
