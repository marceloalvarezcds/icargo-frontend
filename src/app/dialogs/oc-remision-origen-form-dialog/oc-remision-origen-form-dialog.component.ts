import { Unidad } from 'src/app/interfaces/unidad';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcRemisionOrigenDialogData } from 'src/app/interfaces/oc-remision-origen-dialog-data';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionOrigenService } from 'src/app/services/orden-carga-remision-origen.service';
import { subtract } from 'src/app/utils/math';
import { UnidadService } from 'src/app/services/unidad.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-oc-remision-origen-form-dialog',
  templateUrl: './oc-remision-origen-form-dialog.component.html',
  styleUrls: ['./oc-remision-origen-form-dialog.component.scss'],
})
export class OcRemisionOrigenFormDialogComponent {
  conversion: number = 0
  fotoDocumento: string | null = null;
  fotoDocumentoFile: File | null = null;
  form = this.fb.group({
    numero_documento: [this.data?.numero_documento, Validators.required],
    fecha: [this.data?.fecha ?? new Date().toJSON(), Validators.required],
    cantidad: [this.data?.cantidad, Validators.required],
    unidad_id: [this.data?.unidad_id, Validators.required],
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
    const cantidadConvertida = this.cantidad * this.conversion;
    return subtract(this.max, cantidadConvertida);
  }

  constructor(
    private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService,
    private unidadService: UnidadService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<OcRemisionOrigenFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcRemisionOrigenDialogData
  ) {
    this.fotoDocumento = this.data?.foto_documento ?? null;
  }

  getConversionRate(unidadId: number): void {
    this.unidadService.getConversionById(unidadId).subscribe({
      next: (conversionData) => {
        this.conversion = conversionData.conversion_kg || 1;
      },
    });
  }

  onUnidadChange(unidad: Unidad | undefined): void {
    if (unidad) {
      const unidadId = unidad.id;
      this.getConversionRate(unidadId);
    }
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

      const serviceCall = this.data?.id
        ? this.ordenCargaRemisionOrigenService.edit(this.data?.id, formData)
        : this.ordenCargaRemisionOrigenService.create(formData);

      serviceCall.subscribe((response: any) => {
        if (response.warning) {
          this.snackBarService.open(response.warning);
          this.close(response.data);
        } else {
          this.close(response);
        }
      });
    }
  }

  private close(data: OrdenCargaRemisionOrigen): void {
    this.dialogRef.close(data);
  }
}
