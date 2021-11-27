import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-digito-verificador-field',
  templateUrl: './digito-verificador-field.component.html',
  styleUrls: ['./digito-verificador-field.component.scss']
})
export class DigitoVerificadorFieldComponent {

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'digito_verificador';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Dígito verificador';
}
