import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
})
export class NumberFieldComponent {
  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }
  @Input() viewMode: boolean | undefined;
  @Input() autofocus = false;
  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() hint = '';
  @Input() groupName?: string;
  @Input() title = '';
  @Input() readonly = false;
  @Input() patternMessageError = (_: any) => 'El patrón no coincide';
  @Input() autocomplete: 'on' | 'off' | 'nope' = 'nope';
}
