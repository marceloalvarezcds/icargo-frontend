import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoConceptoDescuento } from 'src/app/interfaces/tipo-concepto-descuento';
import { TipoConceptoDescuentoService } from 'src/app/services/tipo-concepto-descuento.service';

@Component({
  selector: 'app-tipo-concepto-descuento-field',
  templateUrl: './tipo-concepto-descuento-field.component.html',
  styleUrls: ['./tipo-concepto-descuento-field.component.scss'],
})
export class TipoConceptoDescuentoFieldComponent {
  list$ = this.tipoConceptoDescuentoService.getList();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_concepto_descuento_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Tipo de Concepto';
  @Input() value: (
    v: TipoConceptoDescuento
  ) => number | string | TipoConceptoDescuento = (v: TipoConceptoDescuento) =>
    v.id;

  @Output() valueChange = new EventEmitter<TipoConceptoDescuento>();

  constructor(
    private tipoConceptoDescuentoService: TipoConceptoDescuentoService
  ) {}

  compareWith(o1?: TipoConceptoDescuento, o2?: TipoConceptoDescuento): boolean {
    return o1?.id === o2?.id;
  }

  textValueFormat(value: TipoConceptoDescuento): string {
    return value.descripcion;
  }
}
