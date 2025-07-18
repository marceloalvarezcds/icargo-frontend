import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcRemisionDestinoDialogData, OrdenCargaRemisionDestinoResponse } from 'src/app/interfaces/oc-remision-destino-dialog-data';
import { OrdenCargaRemisionDestino } from 'src/app/interfaces/orden-carga-remision-destino';
import { Unidad } from 'src/app/interfaces/unidad';
import { OrdenCargaRemisionDestinoService } from 'src/app/services/orden-carga-remision-destino.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UnidadService } from 'src/app/services/unidad.service';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-oc-remision-destino-form-dialog',
  templateUrl: './oc-remision-destino-form-dialog.component.html',
  styleUrls: ['./oc-remision-destino-form-dialog.component.scss'],
})
export class OcRemisionDestinoFormDialogComponent {
  conversion: number = 0
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
    const cantidadConvertida = this.cantidad * this.conversion;
    return subtract(this.max, cantidadConvertida);
  }

  constructor(
    private ordenCargaRemisionDestinoService: OrdenCargaRemisionDestinoService,
    private unidadService: UnidadService,
    private snackBarService: SnackbarService,
    public dialogRef: MatDialogRef<OcRemisionDestinoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: OcRemisionDestinoDialogData
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
        ? this.ordenCargaRemisionDestinoService.edit(this.data?.id, formData)
        : this.ordenCargaRemisionDestinoService.create(formData);

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


  private close(data: OrdenCargaRemisionDestino): void {
    this.dialogRef.close(data);
  }
}
