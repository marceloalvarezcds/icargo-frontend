import { FormGroup } from '@angular/forms';

export const camionSemiNetoData = (form: FormGroup): FormData => {
  const data = JSON.parse(JSON.stringify(form.value));
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  return formData;
};
