import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userProveedorData } from 'src/app/form-data/user-proveedor';
import { UserPuntoVentaCreateFormDialogData } from 'src/app/interfaces/user-punto-venta';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { mustMatch } from 'src/app/validators/password-validator';

@Component({
  selector: 'app-user-punto-venta-create-form-dialog',
  templateUrl: './user-punto-venta-create-form-dialog.component.html',
  styleUrls: ['./user-punto-venta-create-form-dialog.component.scss'],
})
export class UserPuntoVentaCreateFormDialogComponent {
  form = new FormGroup(
    {
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirm_password: new FormControl(null, Validators.required),
    },
    {
      validators: mustMatch('password', 'confirm_password'),
    }
  );

  get isAdmin(): boolean {
    return this.dialogData.is_admin;
  }

  get puntoVentaId(): number {
    return this.dialogData.punto_venta_id;
  }

  constructor(
    private snackbar: SnackbarService,
    private service: PuntoVentaService,
    public dialogRef: MatDialogRef<UserPuntoVentaCreateFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: UserPuntoVentaCreateFormDialogData
  ) {}

  submit(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = userProveedorData(this.form);
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      const createFunction = this.isAdmin
        ? this.service.createAppAdminUser
        : this.service.createAppUser;
      const createUser = createFunction.bind(this.service);
      createUser(this.puntoVentaId, formData).subscribe((prov) => {
        this.snackbar.openSave();
        this.dialogRef.close(prov);
      });
    }
  }
}
