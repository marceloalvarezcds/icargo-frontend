import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-unidad-field',
  templateUrl: './unidad-field.component.html',
  styleUrls: ['./unidad-field.component.scss']
})
export class UnidadFieldComponent {

  list$ = this.unidadService.getList();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'unidad_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Unidad';

  constructor(private unidadService: UnidadService) { }
}
