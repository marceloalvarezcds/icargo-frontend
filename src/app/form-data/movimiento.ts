import { FormGroup } from '@angular/forms';

export const movimientoData = (
  form: FormGroup,
  liquidacion_id: number | null
): FormData => {
  const value = form.value;
  const data = JSON.parse(
    JSON.stringify({
      ...value,
      liquidacion_id,
    })
  );
  const formData = new FormData();
  formData.append('data', JSON.stringify(data));
  return formData;
};
