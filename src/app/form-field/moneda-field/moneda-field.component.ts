import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MonedaService } from 'src/app/services/moneda.service';

@Component({
  selector: 'app-moneda-field',
  templateUrl: './moneda-field.component.html',
  styleUrls: ['./moneda-field.component.scss']
})
export class MonedaFieldComponent {

  list$ = this.monedaService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'moneda_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Moneda';

  constructor(private monedaService: MonedaService) { }
}
