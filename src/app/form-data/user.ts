import { FormGroup } from '@angular/forms';
import { User } from 'src/app/interfaces/user';

export const userData = (form: FormGroup, data: User | undefined): User => {
  const value = form.value;
  const newData = JSON.parse(
    JSON.stringify({
      ...data,
      ...value,
    })
  );
  return newData;
};
