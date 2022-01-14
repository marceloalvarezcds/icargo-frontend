import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-orden-carga-edit-form-tramo',
  templateUrl: './orden-carga-edit-form-tramo.component.html',
  styleUrls: ['./orden-carga-edit-form-tramo.component.scss']
})
export class OrdenCargaEditFormTramoComponent {

  groupName = 'tramo';

  @Input() puedeModificar = false;
  @Input() form?: FormGroup;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }
}
