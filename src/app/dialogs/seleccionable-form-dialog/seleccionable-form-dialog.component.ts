import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { SeleccionableFormDialogService } from './seleccionable-form-dialog.service';

@Component({
  selector: 'app-seleccionable-form-dialog',
  templateUrl: './seleccionable-form-dialog.component.html',
  styleUrls: ['./seleccionable-form-dialog.component.scss'],
  providers: [SeleccionableFormDialogService],
})
export class SeleccionableFormDialogComponent {
  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get data(): SeleccionableBaseModel | undefined {
    return this.service.data;
  }

  get form(): FormGroup {
    return this.service.form;
  }

  get submodule(): string {
    return this.service.submodule;
  }

  constructor(
    dialogRef: MatDialogRef<SeleccionableFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData: SeleccionableFormDialogData,
    private service: SeleccionableFormDialogService
  ) {
    this.service.setDialogRef(dialogRef);
    this.service.setDialogData(dialogData);
  }

  submit(): void {
    this.service.submit();
    
  }
}
