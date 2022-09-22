import { FormGroup } from '@angular/forms';
import { UserPuntoVentaCreateForm, UserPuntoVentaEditForm } from 'src/app/interfaces/user-punto-venta';

export const userProveedorData = (form: FormGroup): UserPuntoVentaCreateForm => {
  const value = form.value;
  const newData = JSON.parse(
    JSON.stringify({
      ...value,
    })
  );
  return newData;
};


export const userProveedorEditData = (form: FormGroup): UserPuntoVentaEditForm => {
  const value = form.value;
  const newData = JSON.parse(
    JSON.stringify({
      ...value,
    })
  );
  return newData;
};
