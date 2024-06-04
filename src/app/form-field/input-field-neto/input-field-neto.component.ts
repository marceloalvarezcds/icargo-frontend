import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-field-neto',
  templateUrl: './input-field-neto.component.html',
  styleUrls: ['./input-field-neto.component.scss']
})
export class InputFieldNetoComponent{

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get rowValue(): string | number | undefined {
    const obj = this.group.getRawValue();
    return obj[this.controlName];
  }

  @Input() autocomplete: 'on' | 'off' | 'nope' = 'nope';
  @Input() formatToPasteNumber = false;
  @Input() formatToPastePhone = false;
  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() hint = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() readonly = false;
  @Input() title = '';

}
