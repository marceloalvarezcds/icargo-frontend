import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-field-by-placa',
  templateUrl: './input-field-by-placa.component.html',
  styleUrls: ['./input-field-by-placa.component.scss']
})
export class InputFieldByPlacaComponent{
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

  @Input() title: string = '';
  @Input() groupName?: string;
  @Input() controlName: string = '';
  @Input() form?: FormGroup;
  @Input() readonly: boolean = false;
  @Input() hint?: string;
  @Input() options: { value: any, label: string }[] = [];
}
