import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-field-no-edit',
  templateUrl: './input-field-no-edit.component.html',
  styleUrls: ['./input-field-no-edit.component.scss']
})
export class InputFieldNoEditComponent{

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
  @Input() disabled: boolean = false;

 

}
