import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { seleccionableData } from 'src/app/form-data/seleccionable';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class SeleccionableFormDialogService {
  modelo!: m;
  submodule!: string;
  dialogRef!: MatDialogRef<any>;
  form = this.fb.group({
    descripcion: [null, Validators.required],
    gestor_carga_id: null,
  });

  private dialogData?: SeleccionableFormDialogData;

  get data(): SeleccionableBaseModel | undefined {
    return this.dialogData?.item;
  }

  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: SeleccionableService
  ) {}

  setDialogData(data: SeleccionableFormDialogData): void {
    const { modelo, submodule } = data;
    this.dialogData = data;
    this.modelo = modelo;
    this.submodule = submodule;
    this.service.setEndpoint(modelo);
    this.form.controls['descripcion'].setValue(data.item?.descripcion);
  }

  setDialogRef(dialogRef: MatDialogRef<any>): void {
    this.dialogRef = dialogRef;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
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
