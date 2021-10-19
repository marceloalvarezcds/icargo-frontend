import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cargo } from 'src/app/interfaces/cargo';
import { CentroOperativoContactoGestorCargaList } from 'src/app/interfaces/centro-operativo-contacto-gestor-carga';
import { Contacto } from 'src/app/interfaces/contacto';
import { CargoService } from 'src/app/services/cargo.service';

@Component({
  selector: 'app-contacto-form-dialog',
  templateUrl: './contacto-form-dialog.component.html',
  styleUrls: ['./contacto-form-dialog.component.scss']
})
export class ContactoFormDialogComponent {

  cargoList$ = this.cargoService.getList();

  form = this.fb.group({
    nombre: [this.data?.contacto_nombre, Validators.required],
    apellido: [this.data?.contacto_apellido, Validators.required],
    telefono: [this.data?.contacto_telefono, Validators.required],
    email: [this.data?.contacto_email, [Validators.required, Validators.email]],
    cargo: [this.data?.cargo, Validators.required],
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear'
  }

  constructor(
    public dialogRef: MatDialogRef<ContactoFormDialogComponent>,
    private fb: FormBuilder,
    private cargoService: CargoService,
    @Inject(MAT_DIALOG_DATA) private data?: CentroOperativoContactoGestorCargaList,
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = JSON.parse(JSON.stringify(this.form.value));
      const cargo: Cargo = value.cargo;
      delete value.cargo;
      const contacto: Contacto = value;
      const data: CentroOperativoContactoGestorCargaList = {
        id: this.data?.id,
        cargo_id: cargo.id,
        cargo,
        centro_operativo_id: this.data?.centro_operativo_id,
        contacto_id: this.data?.contacto_id,
        contacto,
        gestor_carga_id: 1,
        cargo_descripcion: cargo.descripcion,
        contacto_nombre: contacto.nombre,
        contacto_apellido: contacto.apellido,
        contacto_telefono: contacto.telefono,
        contacto_email: contacto.email,
      }
      this.dialogRef.close(data);
    }
  }

  compareWith(o1?: Cargo, o2?: Cargo): boolean {
    return o1?.id === o2?.id;
  }
}
