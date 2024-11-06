import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fecha-field',
  templateUrl: './fecha-field.component.html',
  styleUrls: ['./fecha-field.component.scss']
})
export class FechaFieldComponent {

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = '';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() requerido=false;
  @Input() title = '';

  onDateChange(selectedDate: Date): void {
    const currentDate = new Date();
    const updatedDateTime = new Date(selectedDate);
    updatedDateTime.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());
    this.control.setValue(updatedDateTime); // Actualizar el control con la nueva fecha y hora
  }
}
