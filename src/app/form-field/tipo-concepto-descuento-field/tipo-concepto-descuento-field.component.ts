import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoConceptoDescuentoService } from 'src/app/services/tipo-concepto-descuento.service';

@Component({
  selector: 'app-tipo-concepto-descuento-field',
  templateUrl: './tipo-concepto-descuento-field.component.html',
  styleUrls: ['./tipo-concepto-descuento-field.component.scss']
})
export class TipoConceptoDescuentoFieldComponent {

  list$ = this.tipoConceptoDescuentoService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_concepto_descuento_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Concepto';

  constructor(private tipoConceptoDescuentoService: TipoConceptoDescuentoService) { }
}
