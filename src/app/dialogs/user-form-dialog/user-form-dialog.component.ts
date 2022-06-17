import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/interfaces/user';
import { UserFormDialogData } from 'src/app/interfaces/user-form-dialog-data';
import { UserFormDialogService } from './user-form-dialog.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
  providers: [UserFormDialogService],
})
export class UserFormDialogComponent {
  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get data(): User | undefined {
    return this.service.data;
  }

  get form(): FormGroup {
    return this.service.form;
  }

  get submodule(): string {
    return 'Usuario';
  }

  constructor(
    dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData: UserFormDialogData,
    private service: UserFormDialogService
  ) {
    this.service.setDialogRef(dialogRef);
    this.service.setDialogData(dialogData);
  }

  submit(): void {
    this.service.submit();
  }
}
