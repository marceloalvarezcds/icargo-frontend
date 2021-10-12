import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cargo, Contacto, mockCargoList } from 'src/app/interfaces/contacto';

@Component({
  selector: 'app-contacto-form-dialog',
  templateUrl: './contacto-form-dialog.component.html',
  styleUrls: ['./contacto-form-dialog.component.scss']
})
export class ContactoFormDialogComponent {

  cargoList = mockCargoList.slice();

  form = this.fb.group({
    nombre: [this.contacto?.nombre, Validators.required],
    apellido: [this.contacto?.apellido, Validators.required],
    telefono: [this.contacto?.telefono, Validators.required],
    email: [this.contacto?.email, [Validators.required, Validators.email]],
    cargo: [this.contacto?.cargo, Validators.required],
  });

  get actionText(): string {
    return this.contacto ? 'Editar' : 'Crear'
  }

  constructor(
    public dialogRef: MatDialogRef<ContactoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private contacto?: Contacto,
  ) {}

  create() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  compareWith(o1?: Cargo, o2?: Cargo): boolean {
    return o1?.id === o2?.id;
  }
}
