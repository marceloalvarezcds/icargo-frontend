import { FormGroup } from '@angular/forms';
import {
  MovimientoFleteEditForm,
  MovimientoMermaEditForm,
} from '../interfaces/movimiento';

const getFormData = (value: object): FormData => {
  const data = JSON.parse(JSON.stringify(value));
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  return formData;
};

export const movimientoFleteEditData = (form: FormGroup): FormData => {
  const value: MovimientoFleteEditForm = form.value;
  return getFormData(value);
};

export const movimientoMermaEditData = (form: FormGroup): FormData => {
  const value: MovimientoMermaEditForm = form.value;
  return getFormData(value);
};
