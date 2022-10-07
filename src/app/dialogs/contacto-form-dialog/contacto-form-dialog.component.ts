import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Cargo } from 'src/app/interfaces/cargo';
import { Contacto } from 'src/app/interfaces/contacto';
import { ContactoGestorCargaList } from 'src/app/interfaces/contacto-gestor-carga';
import { User } from 'src/app/interfaces/user';
import { ContactoService } from 'src/app/services/contacto.service';
import { UserService } from 'src/app/services/user.service';
import { emailValidator } from 'src/app/validators/email-validator';

@Component({
  selector: 'app-contacto-form-dialog',
  templateUrl: './contacto-form-dialog.component.html',
  styleUrls: ['./contacto-form-dialog.component.scss'],
})
export class ContactoFormDialogComponent implements OnDestroy {
  isExistContacto = false;
  telefonoBlur$ = new Subject<boolean>();
  emailBlur$ = new Subject<boolean>();
  user?: User;
  userSubscription = this.userService.getLoggedUser().subscribe((user) => {
    this.user = user;
  });

  form = this.fb.group({
    telefono: [
      this.data?.contacto_telefono,
      [Validators.required, Validators.pattern('^([+]595|0)([0-9]{9})$')],
    ],
    email: [this.data?.contacto_email, [Validators.required, emailValidator]],
    nombre: [this.data?.contacto_nombre, Validators.required],
    apellido: [this.data?.contacto_apellido, Validators.required],
    alias: this.data?.alias,
    cargo: [this.data?.cargo, Validators.required],
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get cargoControl(): FormControl {
    return this.form.get('cargo') as FormControl;
  }

  get telefonoControl(): FormControl {
    return this.form.get('telefono') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  telefonoEmailSubscription = combineLatest([
    this.telefonoBlur$,
    this.emailBlur$,
  ])
    .pipe(
      filter(
        ([telTouched, emailTouched]) =>
          telTouched &&
          this.telefonoControl.valid &&
          emailTouched &&
          this.emailControl.valid
      )
    )
    .subscribe(() => {
      const telefono = this.telefonoControl.value;
      const email = this.emailControl.value;
      this.setContacto();
      this.contactoService.get(telefono, email).subscribe((contacto) => {
        this.setContacto(contacto);
      });
    });

  constructor(
    public dialogRef: MatDialogRef<ContactoFormDialogComponent>,
    private fb: FormBuilder,
    private contactoService: ContactoService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private data?: ContactoGestorCargaList
  ) {}

  ngOnDestroy(): void {
    this.telefonoEmailSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = JSON.parse(JSON.stringify(this.form.value));
      const cargo: Cargo = value.cargo;
      delete value.cargo;
      const contacto: Contacto = value;
      const data: ContactoGestorCargaList = {
        id: this.data?.id,
        cargo_id: cargo.id,
        cargo,
        contacto_id: this.data?.contacto_id,
        contacto,
        gestor_carga_id: this.user?.gestor_carga_id,
        alias: value.alias,
        cargo_descripcion: cargo.descripcion,
        contacto_nombre: contacto.nombre,
        contacto_apellido: contacto.apellido,
        contacto_telefono: contacto.telefono,
        contacto_email: contacto.email,
      };
      this.dialogRef.close(data);
    }
  }

  compareWith(o1?: Cargo, o2?: Cargo): boolean {
    return o1?.id === o2?.id;
  }

  private setContacto(contacto?: Contacto): void {
    this.isExistContacto = !!contacto;
    if (contacto) {
      this.form.controls['nombre'].setValue(contacto.nombre);
      this.form.controls['apellido'].setValue(contacto.apellido);
    } else if (
      this.form.controls['nombre'].touched &&
      this.form.controls['apellido'].touched
    ) {
      this.form.controls['nombre'].setValue(null);
      this.form.controls['apellido'].setValue(null);
    }
  }
}
