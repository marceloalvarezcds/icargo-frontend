import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss'],
})
export class PasswordFieldComponent {
  showPassword = false;

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

  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() readonly = false;
  @Input() title = '';
}
