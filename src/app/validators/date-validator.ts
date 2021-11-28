import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {

  static date(formControl: AbstractControl): ValidationErrors | null {
    if (
      formControl && formControl.value
      && !(
        moment(formControl.value, 'DD/MM/YYYY', true).isValid()
        || moment(formControl.value, 'YYYY-MM-DD', true).isValid()
        || moment(formControl.value, 'YYYY-MM-DDTHH:mm:ss', true).isValid()
      )
    ) {
      return { 'dateVaidator': true };
    }
    return null;
  }
}
