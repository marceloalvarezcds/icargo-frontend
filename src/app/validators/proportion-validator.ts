import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";

export class ProportionValidator {

  static max(max: number, controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const actual = formArray.value.reduce((acc: number, cur: any) => acc + (cur[controlName] ?? 0), 0);
      return actual <= max ? null : { max: { max, actual } };
    }
  }
};
