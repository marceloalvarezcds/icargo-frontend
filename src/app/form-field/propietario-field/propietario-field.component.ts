import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PropietarioService } from 'src/app/services/propietario.service';

@Component({
  selector: 'app-propietario-field',
  templateUrl: './propietario-field.component.html',
  styleUrls: ['./propietario-field.component.scss']
})
export class PropietarioFieldComponent {

  list$ = this.propietarioService.getListByGestorCuenta();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'propietario_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Propietario';

  constructor(private propietarioService: PropietarioService) { }
}
