import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { seleccionableData } from 'src/app/form-data/seleccionable';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { TipoCuenta } from 'src/app/interfaces/tipo-cuenta';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-tipo-cuenta-form-dialog',
  templateUrl: './tipo-cuenta-form-dialog.component.html',
  styleUrls: ['./tipo-cuenta-form-dialog.component.scss'],
})
export class TipoCuentaFormDialogComponent {
  modelo!: m;
  submodule!: string;
  form = this.fb.group({
    codigo: [this.data?.codigo, [Validators.required, Validators.maxLength(3)]],
    descripcion: [this.data?.descripcion, Validators.required],
  });

  get data(): TipoCuenta | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private dialogData: SeleccionableFormDialogData<TipoCuenta>,
    private dialogRef: MatDialogRef<TipoCuentaFormDialogComponent>,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: SeleccionableService<TipoCuenta>
  ) {
    const { modelo, submodule } = dialogData;
    this.modelo = modelo;
    this.submodule = submodule;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    console.log(this.form.controls['codigo']);
    if (this.form.valid) {
      const data = seleccionableData(this.form, this.data);
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
