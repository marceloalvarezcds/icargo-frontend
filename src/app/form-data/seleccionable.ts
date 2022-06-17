import { FormGroup } from '@angular/forms';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';

export const seleccionableData = (
  form: FormGroup,
  data: SeleccionableBaseModel | undefined
): SeleccionableBaseModel => {
  const value = form.value;
  const newData = JSON.parse(
    JSON.stringify({
      ...data,
      ...value,
    })
  );
  return newData;
};
