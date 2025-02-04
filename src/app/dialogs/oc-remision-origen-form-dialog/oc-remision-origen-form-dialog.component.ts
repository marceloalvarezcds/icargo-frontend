import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcRemisionOrigenDialogData } from 'src/app/interfaces/oc-remision-origen-dialog-data';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionOrigenService } from 'src/app/services/orden-carga-remision-origen.service';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-oc-remision-origen-form-dialog',
  templateUrl: './oc-remision-origen-form-dialog.component.html',
  styleUrls: ['./oc-remision-origen-form-dialog.component.scss'],
})
export class OcRemisionOrigenFormDialogComponent {
  fotoDocumento: string | null = null;
  fotoDocumentoFile: File | null = null;
  form = this.fb.group({
    numero_documento: [this.data?.numero_documento, Validators.required],
    fecha: [this.data?.fecha ?? new Date().toJSON(), Validators.required],
    cantidad: [this.data?.cantidad, Validators.required],
    unidad_id: [this.data?.unidad_id ?? 1, Validators.required], 
    foto_documento: this.data?.foto_documento,
    nuevo_campo: null
  });
  

  get actionText(): string {
    return this.data ? 'EDITAR' : 'NUEVO';
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

  get data(): OrdenCargaRemisionOrigen | undefined {
    return this.dialogData.item;
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
    private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService,
    public dialogRef: MatDialogRef<OcRemisionOrigenFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcRemisionOrigenDialogData
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
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.fotoDocumentoFile) {
        formData.append('foto_documento_file', this.fotoDocumentoFile);
      }
      if (this.data?.id) {
        this.ordenCargaRemisionOrigenService
          .edit(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.ordenCargaRemisionOrigenService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: OrdenCargaRemisionOrigen): void {
    this.dialogRef.close(data);
  }
}
