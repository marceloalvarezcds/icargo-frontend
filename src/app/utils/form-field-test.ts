import { FormControl, FormGroup } from '@angular/forms';
import { FormFieldComponent } from 'src/app/interfaces/form-field-component';

export function createFormGroup<Component extends FormFieldComponent>(component: Component): void {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}
