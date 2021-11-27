import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';

@Component({
  selector: 'app-alias-field',
  templateUrl: './alias-field.component.html',
  styleUrls: ['./alias-field.component.scss']
})
export class AliasFieldComponent {

  a = PermisoAccionEnum;

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'alias';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() modelo?: PermisoModeloEnum;
  @Input() title = 'Alias';
}
