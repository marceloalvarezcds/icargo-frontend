import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
})
export class NumberFieldComponent {
  decimalPattern = '^\\d*(\\.\\d{0,2})?$';
  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get hasMoreThanTwoDecimals(): boolean {
    const value = this.control?.value;
    if (value) {
      const valueAsString = value.toString();
      const decimalPart = valueAsString.split('.')[1];
      return decimalPart && decimalPart.length > 2;
    }
    return false;
  }
  

  @Input() viewMode: boolean | undefined;
  @Input() moneda: string = '';  // simbolo de la moneda (PYG, USD, etc.)
  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() hint = '';
  @Input() groupName?: string;
  @Input() title = '';
  @Input() readonly = false;
  @Input() disabled = false;
  @Input() requerido = false;
  @Input() patternMessageError = (_: any) => 'El patrón no coincide';
  @Input() autocomplete: 'on' | 'off' | 'nope' = 'nope';
}
