import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moneda } from 'src/app/interfaces/moneda';
import { MonedaService } from 'src/app/services/moneda.service';

@Component({
  selector: 'app-moneda-field',
  templateUrl: './moneda-field.component.html',
  styleUrls: ['./moneda-field.component.scss']
})
export class MonedaFieldComponent {

  list$ = this.monedaService.getList();

  get group(): FormGroup {
    if (this.groupName) {
      return this.form!.get(this.groupName) as FormGroup;
    }
    return this.form!;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'moneda_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Moneda';

  constructor(private monedaService: MonedaService) { }

  compareWith(o1?: Moneda, o2?: Moneda): boolean {
    return o1?.id === o2?.id;
  }
}
