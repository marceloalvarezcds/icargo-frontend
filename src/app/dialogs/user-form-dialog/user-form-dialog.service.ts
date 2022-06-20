import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { userData } from 'src/app/form-data/user';
import { User } from 'src/app/interfaces/user';
import { UserFormDialogData } from 'src/app/interfaces/user-form-dialog-data';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { emailValidator } from 'src/app/validators/email-validator';
import { mustMatch } from 'src/app/validators/password-validator';

@Injectable({
  providedIn: 'root',
})
export class UserFormDialogService {
  form = new FormGroup(
    {
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, emailValidator]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirm_password: new FormControl(null, Validators.required),
      gestor_carga_id: new FormControl(null),
    },
    {
      validators: mustMatch('password', 'confirm_password'),
    }
  );

  private dialogData?: UserFormDialogData;
  private dialogRef!: MatDialogRef<any>;

  get data(): User | undefined {
    return this.dialogData?.item;
  }

  constructor(
    private snackbar: SnackbarService,
    private service: UserService
  ) {}

  setDialogData(dialogData: UserFormDialogData): void {
    this.dialogData = dialogData;
    const data = this.data;
    if (data) {
      this.form.patchValue({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        gestor_carga_id: data.gestor_carga_id,
      });
      this.form.controls['password'].removeValidators(Validators.required);
      this.form.controls['password'].updateValueAndValidity();
      this.form.controls['confirm_password'].removeValidators(
        Validators.required
      );
      this.form.controls['confirm_password'].updateValueAndValidity();
    }
  }

  setDialogRef(dialogRef: MatDialogRef<any>): void {
    this.dialogRef = dialogRef;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = userData(this.form, this.data);
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.data && this.data.id) {
        this.service.edit(this.data.id, formData).subscribe(() => {
          this.snackbar.openUpdate();
          this.dialogRef.close(data);
        });
      } else {
        this.service.create(formData).subscribe(() => {
          this.snackbar.openSave();
          this.dialogRef.close(data);
        });
      }
    }
  }
}
