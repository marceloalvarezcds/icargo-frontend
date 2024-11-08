import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email-field',
  templateUrl: './email-field.component.html',
  styleUrls: ['./email-field.component.scss']
})
export class EmailFieldComponent {

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'email';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Correo electrónico';
  @Input() requerido = false;

}
