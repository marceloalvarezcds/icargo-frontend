import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FleteAnticipo,
  FleteAnticipoForm,
} from 'src/app/interfaces/flete-anticipo';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';

@Component({
  selector: 'app-flete-form-anticipos',
  templateUrl: './flete-form-anticipos.component.html',
  styleUrls: ['./flete-form-anticipos.component.scss'],
})
export class FleteFormAnticiposComponent {
  groupName = 'anticipos';
  subs = this.tipoAnticipoService.getList().subscribe((list) => {
    if (this.formArray.length === 0) {
      list.forEach((it) => {
        this.formArray.push(
          this.createForm({
            tipo_id: it.id,
            tipo_descripcion: it.descripcion,
            porcentaje: null,
            concepto: it.descripcion,
          })
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
          (it: FleteAnticipo) => it.tipo_id === item.tipo_id
        );
        this.formArray.setControl(idx, this.createForm(item));
      });
    }
    this.checkDisable();
  }

  constructor(
    private fb: FormBuilder,
    private tipoAnticipoService: TipoAnticipoService
  ) {}

  private createForm(data: FleteAnticipoForm): FormGroup {
    return this.fb.group({
      id: data.id,
      tipo_id: data.tipo_id,
      tipo_descripcion: data.tipo_descripcion,
      porcentaje: [data.porcentaje, [Validators.min(0), Validators.max(100)]],
    });
  }

  private checkDisable(): void {
    if (!this.isCreate && !this.puedeModificar) {
      this.formArray.disable();
    } else {
      this.formArray.enable();
    }
  }
}
