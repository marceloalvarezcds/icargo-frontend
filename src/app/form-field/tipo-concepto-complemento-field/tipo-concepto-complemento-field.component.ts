import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { TipoConceptoComplementoService } from 'src/app/services/tipo-concepto-complemento.service';

@Component({
  selector: 'app-tipo-concepto-complemento-field',
  templateUrl: './tipo-concepto-complemento-field.component.html',
  styleUrls: ['./tipo-concepto-complemento-field.component.scss'],
})
export class TipoConceptoComplementoFieldComponent {
  list$ = this.tipoConceptoComplementoService.getList();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_concepto_complemento_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Tipo de Concepto';
  @Input() value: (
    v: TipoConceptoComplemento
  ) => number | string | TipoConceptoComplemento = (
    v: TipoConceptoComplemento
  ) => v.id;

  @Output() valueChange = new EventEmitter<TipoConceptoComplemento>();

  constructor(
    private tipoConceptoComplementoService: TipoConceptoComplementoService
  ) {}

  compareWith(
    o1?: TipoConceptoComplemento,
    o2?: TipoConceptoComplemento
  ): boolean {
    return o1?.id === o2?.id;
  }

  textValueFormat(value: TipoConceptoComplemento): string {
    return value.descripcion;
  }
}
