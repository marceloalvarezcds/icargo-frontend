import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import {
  OrdenCargaAnticipoPorcentaje,
  OrdenCargaAnticipoPorcentajeForm,
} from 'src/app/interfaces/orden-carga-anticipo-porcentaje';
import { ProportionValidator } from 'src/app/validators/proportion-validator';

@Component({
  selector: 'app-orden-carga-flete',
  templateUrl: './orden-carga-flete.component.html',
  styleUrls: ['./orden-carga-flete.component.scss']
})
export class OrdenCargaFleteComponent  {
  groupName = 'porcentaje_anticipos';

  get formArray(): FormArray {
    return this.form!.get(this.groupName) as FormArray;
  }

  @Input() form?: FormGroup;
  @Input() isCreate = false;
  @Input() anicipoMaximo = 100;
  @Input() puedeModificar = false;
  @Input() set list(list: OrdenCargaAnticipoPorcentaje[]) {
    if (!this.form) return;
    if (this.formArray.length === 0) {
      list.forEach((item) => {
        this.formArray.push(this.createForm(item));
      });
    } else {
      list.forEach((item) => {
        const idx = this.formArray.value.findIndex(
          (it: OrdenCargaAnticipoPorcentaje) =>
            it.flete_anticipo_id === item.flete_anticipo_id &&
            it.orden_carga_id === item.orden_carga_id
        );
        this.formArray.setControl(idx, this.createForm(item));
      });
    }
    this.checkDisable();
  }
  @Input() set oc(oc: OrdenCarga | undefined) {
    if (!this.form) return;
    if (oc) {
      this.formArray.setValidators(
        ProportionValidator.max(oc.flete_anticipo_maximo, 'porcentaje')
      );
    }
  }
  @Input() set formDisabledTime(_: Date) {
    if (!this.form) return;
    if (this.puedeModificar) {
      this.formArray.enable();
    }
  }

  constructor(private fb: FormBuilder) {}

  private createForm(data: OrdenCargaAnticipoPorcentajeForm): FormGroup {
    const porcentajeMinimo = data.porcentaje_minimo ?? 0;
    return this.fb.group({
      id: data.id,
      flete_anticipo_id: data.flete_anticipo_id,
      orden_carga_id: data.orden_carga_id,
      concepto: data.concepto,
      porcentaje: [
        data.porcentaje,
        [Validators.min(porcentajeMinimo), Validators.max(100)],
      ],
    });
  }

  private checkDisable(): void {
    if (!this.isCreate && !this.puedeModificar) {
      this.formArray.disable({ emitEvent: false });
    } else {
      this.formArray.enable({ emitEvent: false });
    }
  }
}
