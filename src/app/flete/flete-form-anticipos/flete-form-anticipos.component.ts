import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FleteAnticipo,
  FleteAnticipoForm,
} from 'src/app/interfaces/flete-anticipo';
import { FleteAnticipoService } from 'src/app/services/flete-anticipo.service';

@Component({
  selector: 'app-flete-form-anticipos',
  templateUrl: './flete-form-anticipos.component.html',
  styleUrls: ['./flete-form-anticipos.component.scss'],
})
export class FleteFormAnticiposComponent {
  groupName = 'anticipos';
  subs = this.fleteAnticipoService
    .getTipoAnticipoInsumoList()
    .subscribe((list) => {
      if (this.formArray.length === 0) {
        list.forEach((it) => {
          this.formArray.push(
            this.createForm({
              tipo_id: it.tipo_id,
              tipo_descripcion: it.tipo_descripcion,
              tipo_insumo_id: it.tipo_insumo_id,
              tipo_insumo_descripcion: it.tipo_insumo_descripcion,
              porcentaje: null,
              concepto: it.concepto,
            }),
            { emitEvent: false }
          );
        });
      }
      this.checkDisable();
    });

  get formArray(): FormArray {
    return this.form!.get(this.groupName) as FormArray;
  }

  @Input() form?: FormGroup;
  @Input() isCreate = false;
  @Input() puedeModificar = false;
  @Input() set anticipoList(list: FleteAnticipo[]) {
    if (this.formArray.length === 0) {
      list.forEach((item) => {
        this.formArray.push(this.createForm(item));
      });
    } else {
      list.forEach((item) => {
        const idx = this.formArray.value.findIndex(
          (it: FleteAnticipo) =>
            it.tipo_id === item.tipo_id && it.concepto === item.concepto
        );
        this.formArray.setControl(idx, this.createForm(item));
      });
    }
    this.checkDisable();
  }

  constructor(
    private fb: FormBuilder,
    private fleteAnticipoService: FleteAnticipoService
  ) {}

  private createForm(data: FleteAnticipoForm): FormGroup {
    return this.fb.group({
      id: data.id,
      tipo_id: data.tipo_id,
      tipo_descripcion: data.tipo_descripcion,
      tipo_insumo_id: data.tipo_insumo_id,
      tipo_insumo_descripcion: data.tipo_insumo_descripcion,
      concepto: data.concepto,
      porcentaje: [data.porcentaje, [Validators.min(0), Validators.max(100)]],
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
