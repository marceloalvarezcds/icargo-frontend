import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(
  formControl: AbstractControl
): ValidationErrors | null {
  if (
    formControl &&
    formControl.value &&
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formControl.value)
  ) {
    return { email: true };
  }
  return null;
}
