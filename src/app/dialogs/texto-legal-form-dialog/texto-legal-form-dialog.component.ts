import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { seleccionableData } from 'src/app/form-data/seleccionable';
import { SeleccionableFormDialogData } from 'src/app/interfaces/seleccionable-form-dialog-data';
import { TextoLegal } from 'src/app/interfaces/texto-legal';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TextoLegalService } from 'src/app/services/texto-legal.service';
import { TipoMovimientoService } from 'src/app/services/tipo-movimiento.service';

@Component({
  selector: 'app-texto-legal-form-dialog',
  templateUrl: './texto-legal-form-dialog.component.html',
  styleUrls: ['./texto-legal-form-dialog.component.scss']
})
export class TextoLegalFormDialogComponent {

  modelo!: m;
  submodule!: string;
  form = this.fb.group({
    titulo: [this.data?.titulo, [Validators.required, Validators.maxLength(50)]],
    descripcion: [this.data?.descripcion, [Validators.required, Validators.maxLength(255)]],
  });

  get data(): TextoLegal | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private dialogData: SeleccionableFormDialogData<TextoLegal>,
    private dialogRef: MatDialogRef<TextoLegalFormDialogComponent>,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: TextoLegalService
  ) {
    const { modelo, submodule } = dialogData;
    this.modelo = modelo;
    this.submodule = submodule;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const descripcionControl = this.form.get('descripcion');
      if (descripcionControl && descripcionControl.value) {
        descripcionControl.setValue(descripcionControl.value.toUpperCase());
      }
      const tituloControl = this.form.get('titulo');
      if (tituloControl && tituloControl.value) {
        tituloControl.setValue(tituloControl.value.toUpperCase());
      }
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
