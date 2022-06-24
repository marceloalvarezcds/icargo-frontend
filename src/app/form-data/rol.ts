import { FormGroup } from '@angular/forms';
import { Rol } from 'src/app/interfaces/rol';

export const rolData = (form: FormGroup, data: Rol | undefined): Rol => {
  const value = form.value;
  const newData = JSON.parse(
    JSON.stringify({
      ...data,
      ...value,
    })
  );
  return newData;
};
