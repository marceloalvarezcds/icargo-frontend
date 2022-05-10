import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ContactoGestorCargaList } from 'src/app/interfaces/contacto-gestor-carga';
import { FormFieldComponent } from 'src/app/interfaces/form-field-component';

export function createFormGroup<Component extends FormFieldComponent>(
  component: Component
): void {
  component.groupName = 'grupo';
  component.controlName = 'control';
  component.form = new FormGroup({
    grupo: new FormGroup({
      control: new FormControl(null),
    }),
  });
}

export function createConactoForm(
  contacto: ContactoGestorCargaList
): FormGroup {
  return new FormGroup({
    id: new FormControl(contacto.contacto_id),
    nombre: new FormControl(contacto.contacto_nombre, Validators.required),
    apellido: new FormControl(contacto.contacto_apellido, Validators.required),
    telefono: new FormControl(contacto.contacto_telefono, Validators.required),
    email: new FormControl(contacto.contacto_email, Validators.required),
    alias: new FormControl(contacto.alias),
    cargo: new FormControl(contacto.cargo, Validators.required),
  });
}

export function addContactoInFormByList(
  control: AbstractControl | null,
  list: ContactoGestorCargaList[]
): void {
  const contactoArray: FormArray | null = control as FormArray;
  list.forEach((contacto) => {
    contactoArray?.push(createConactoForm(contacto));
  });
}
