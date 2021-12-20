import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TipoConceptoComplementoService } from 'src/app/services/tipo-concepto-complemento.service';

@Component({
  selector: 'app-tipo-concepto-complemento-field',
  templateUrl: './tipo-concepto-complemento-field.component.html',
  styleUrls: ['./tipo-concepto-complemento-field.component.scss']
})
export class TipoConceptoComplementoFieldComponent {

  list$ = this.tipoConceptoComplementoService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'tipo_concepto_complemento_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Tipo de Concepto';

  constructor(private tipoConceptoComplementoService: TipoConceptoComplementoService) { }
}
