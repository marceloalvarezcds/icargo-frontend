import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-telefono-field',
  templateUrl: './telefono-field.component.html',
  styleUrls: ['./telefono-field.component.scss']
})
export class TelefonoFieldComponent {

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'telefono';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Teléfono';
  @Input() readonly = false;
}
