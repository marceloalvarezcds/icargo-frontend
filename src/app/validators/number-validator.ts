import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { numberWithoutCommas } from 'src/app/utils/thousands-separator';

export class NumberValidator {

  static max(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formControl = control as FormControl;
      const actual = numberWithoutCommas(formControl.value) ?? 0;
      return actual <= max ? null : { max: { max, actual } };
    }
  }
};
