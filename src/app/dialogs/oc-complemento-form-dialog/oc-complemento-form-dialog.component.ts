import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Moneda } from 'src/app/interfaces/moneda';
import { OcComplementoDialogData } from 'src/app/interfaces/oc-complemento-dialog-data';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { OrdenCargaComplementoService } from 'src/app/services/orden-carga-complemento.service';

@Component({
  selector: 'app-oc-complemento-form-dialog',
  templateUrl: './oc-complemento-form-dialog.component.html',
  styleUrls: ['./oc-complemento-form-dialog.component.scss'],
})
export class OcComplementoFormDialogComponent {
  form = this.fb.group({
    concepto: [this.data?.concepto, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a pagar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_moneda: [this.data?.propietario_moneda, Validators.required],
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    habilitar_cobro_remitente: this.data?.habilitar_cobro_remitente,
    remitente_monto: [this.data?.remitente_monto, [Validators.min(0)]],
    remitente_moneda: this.data?.remitente_moneda,
    // FIN Monto a cobrar al Remitente
  });

  cobroARemitenteSubscription =
    this.cobroARemitenteControl.valueChanges.subscribe((val) => {
      if (val) {
        this.form.controls['remitente_monto'].setValidators(
          Validators.required
        );
        this.form.controls['remitente_moneda'].setValidators(
          Validators.required
        );
      } else {
        this.form.controls['remitente_monto'].removeValidators(
          Validators.required
        );
        this.form.controls['remitente_moneda'].removeValidators(
          Validators.required
        );
      }
      this.form.controls['remitente_moneda'].updateValueAndValidity();
      this.form.controls['remitente_monto'].updateValueAndValidity();
    });

  get data(): OrdenCargaComplemento | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    return this.data ? 'Editar' : 'NUEVO';
  }

  get anticipadoControl(): FormControl {
    return this.form.get('anticipado') as FormControl;
  }

  get anticipado(): boolean {
    return this.anticipadoControl.value;
  }

  get cobroARemitenteControl(): FormControl {
    return this.form.get('habilitar_cobro_remitente') as FormControl;
  }

  get cobroARemitente(): boolean {
    return this.cobroARemitenteControl.value;
  }

  constructor(
    private ordenCargaComplementoService: OrdenCargaComplementoService,
    public dialogRef: MatDialogRef<OcComplementoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcComplementoDialogData
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = JSON.parse(
        JSON.stringify({
          ...this.form.value,
          id: this.data?.id,
          flete_id: this.data?.flete_id,
          orden_carga_id: this.dialogData.orden_carga_id,
        })
      );
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.data?.id) {
        this.ordenCargaComplementoService
          .edit(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.ordenCargaComplementoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  valueConcepto(item: TipoConceptoComplemento): TipoConceptoComplemento {
    return item;
  }

  valueMoneda(item: Moneda): Moneda {
    return item;
  }

  private close(data: OrdenCargaComplemento): void {
    this.dialogRef.close(data);
  }
}
