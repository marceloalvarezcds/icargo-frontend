import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fecha-field',
  templateUrl: './fecha-field.component.html',
  styleUrls: ['./fecha-field.component.scss']
})
export class FechaFieldComponent {

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Fecha';
}
