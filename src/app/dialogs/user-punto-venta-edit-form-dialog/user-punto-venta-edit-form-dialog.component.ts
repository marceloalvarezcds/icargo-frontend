import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { userProveedorEditData } from 'src/app/form-data/user-proveedor';
import { UserPuntoVentaEditFormDialogData } from 'src/app/interfaces/user-punto-venta';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { mustMatch } from 'src/app/validators/password-validator';

@Component({
  selector: 'app-user-punto-venta-edit-form-dialog',
  templateUrl: './user-punto-venta-edit-form-dialog.component.html',
  styleUrls: ['./user-punto-venta-edit-form-dialog.component.scss'],
})
export class UserPuntoVentaEditFormDialogComponent {
  form = new FormGroup(
    {
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

  get userId(): number {
    return this.dialogData.user_id;
  }

  get username(): string {
    return this.dialogData.username;
  }

  constructor(
    private snackbar: SnackbarService,
    private service: UserService,
    public dialogRef: MatDialogRef<UserPuntoVentaEditFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: UserPuntoVentaEditFormDialogData
  ) {}

  submit(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = userProveedorEditData(this.form);
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.service.edit(this.userId, formData).subscribe((prov) => {
        this.snackbar.openSave();
        this.dialogRef.close(prov);
      });
    }
  }
}
