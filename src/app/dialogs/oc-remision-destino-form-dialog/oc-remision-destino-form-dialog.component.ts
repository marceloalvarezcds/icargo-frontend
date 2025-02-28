import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcRemisionDestinoDialogData } from 'src/app/interfaces/oc-remision-destino-dialog-data';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { OrdenCargaRemisionDestinoService } from 'src/app/services/orden-carga-remision-destino.service';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-oc-remision-destino-form-dialog',
  templateUrl: './oc-remision-destino-form-dialog.component.html',
  styleUrls: ['./oc-remision-destino-form-dialog.component.scss'],
})
export class OcRemisionDestinoFormDialogComponent {
  fotoDocumento: string | null = null;
  fotoDocumentoFile: File | null = null;
  form = this.fb.group({
    numero_documento: [this.data?.numero_documento, Validators.required],
    fecha: [this.data?.fecha ?? new Date().toJSON(), Validators.required],
    cantidad: [this.data?.cantidad, Validators.required],
    unidad_id: [this.data?.unidad_id ?? 1, Validators.required],
    foto_documento: this.data?.foto_documento,
    numero_documento_origen: this.data?.numero_documento_origen,
    destino_id: this.data?.destino_id,
    nuevo_campo:[null]
  });

  get actionText(): string {
    return this.data ? 'EDITAR' : 'NUEVO';
  }

  get data(): OrdenCargaRemisionDestino | undefined {
    return this.dialogData.item;
  }

  get cantidad(): number {
    return parseInt(this.cantidadControl.value, 10);
  }

  get cantidadControl(): FormControl {
    return this.form.get('cantidad') as FormControl;
  }

  get cantidadHint(): string {
    if (this.cantidad > this.max) {
      return `<span class="hint-alert">La cantidad supera en <strong>${subtract(
        this.cantidad,
        this.max
      ).toLocaleString()}</strong> kg al Neto</span>`;
    }
    let text = `Neto <strong>${this.max.toLocaleString()}</strong>`;
    if (this.saldo) {
      text += ` | Saldo <strong>${this.saldo.toLocaleString()}</strong>`;
    }
    return text;
  }

  get fotoDocumentoControl(): FormControl {
    return this.form.get('foto_documento') as FormControl;
  }

  get max(): number {
    return this.dialogData.cantidad_disponible;
  }

  get saldo(): number {
    return subtract(this.max, this.cantidad);
  }

  constructor(
    private ordenCargaRemisionDestinoService: OrdenCargaRemisionDestinoService,
    public dialogRef: MatDialogRef<OcRemisionDestinoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: OcRemisionDestinoDialogData
  ) {
    this.fotoDocumento = this.data?.foto_documento ?? null;
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = JSON.parse(
        JSON.stringify({
          ...this.form.value,
          id: this.data?.id,
          orden_carga_id: this.dialogData.orden_carga_id,
        })
      );

      const unidad = data.unidad_id;
      data.unidad_id = unidad.id;

      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFile) {
        formData.append('foto_documento_file', this.fotoDocumentoFile);
      }
      if (this.data?.id) {
        this.ordenCargaRemisionDestinoService
          .edit(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.ordenCargaRemisionDestinoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: OrdenCargaRemisionDestino): void {
    this.dialogRef.close(data);
  }
}
