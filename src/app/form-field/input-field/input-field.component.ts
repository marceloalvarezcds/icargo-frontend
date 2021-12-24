import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = '';
}
