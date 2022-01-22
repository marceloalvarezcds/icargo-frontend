import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcRemisionDestinoDialogData } from 'src/app/interfaces/oc-remision-destino-dialog-data';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionDestinoService } from 'src/app/services/orden-carga-remision-destino.service';
import { NumberValidator } from 'src/app/validators/number-validator';

@Component({
  selector: 'app-oc-remision-destino-form-dialog',
  templateUrl: './oc-remision-destino-form-dialog.component.html',
  styleUrls: ['./oc-remision-destino-form-dialog.component.scss']
})
export class OcRemisionDestinoFormDialogComponent {

  fotoDocumento: string | null = null;
  fotoDocumentoFile: File | null = null;
  form = this.fb.group({
    numero_documento: [this.data?.numero_documento, Validators.required],
    cantidad: [this.data?.cantidad, [Validators.required, NumberValidator.max(this.max)]],
    unidad_id: [this.data?.unidad_id, Validators.required],
    foto_documento: this.data?.foto_documento,
    numero_documento_origen: this.data?.numero_documento_origen,
    destino_id: this.data?.destino_id,
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear'
  }

  get data(): OrdenCargaRemisionDestino | undefined {
    return this.dialogData.item;
  }

  get cantidadDestino(): number {
    return this.dialogData.cantidad_destino;
  }

  get cantidadOrigen(): number {
    return this.dialogData.cantidad_origen;
  }

  get cantidadControl(): FormControl {
    return this.form.get('cantidad') as FormControl;
  }

  get cantidad(): number {
    return this.cantidadControl.value;
  }

  get max(): number {
    return this.cantidadOrigen - this.cantidadDestino;
  }

  constructor(
    private ordenCargaRemisionDestinoService: OrdenCargaRemisionDestinoService,
    public dialogRef: MatDialogRef<OcRemisionDestinoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: OcRemisionDestinoDialogData,
  ) {
    this.fotoDocumento = this.data?.foto_documento ?? null;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = JSON.parse(JSON.stringify({
        ...this.form.value,
        id: this.data?.id,
        orden_carga_id: this.dialogData.orden_carga_id,
      }));
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFile) {
        formData.append('foto_documento_file', this.fotoDocumentoFile);
      }
      if (this.data?.id) {
        this.ordenCargaRemisionDestinoService.edit(this.data?.id, formData).subscribe(this.close.bind(this));
      } else {
        this.ordenCargaRemisionDestinoService.create(formData).subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: OrdenCargaRemisionDestino): void {
    this.dialogRef.close(data);
  }
}
