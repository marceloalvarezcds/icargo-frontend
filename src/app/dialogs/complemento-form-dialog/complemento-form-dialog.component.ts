import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { Moneda } from 'src/app/interfaces/moneda';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { Unidad } from 'src/app/interfaces/unidad';

@Component({
  selector: 'app-complemento-form-dialog',
  templateUrl: './complemento-form-dialog.component.html',
  styleUrls: ['./complemento-form-dialog.component.scss']
})
export class ComplementoFormDialogComponent {

  form = this.fb.group({
    concepto: [this.data?.concepto, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a pagar al Propietario
    propietario_monto: [this.data?.propietario_monto, [Validators.required, Validators.min(0)]],
    propietario_moneda: [this.data?.propietario_moneda, Validators.required],
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    habilitar_cobro_remitente: this.data?.habilitar_cobro_remitente,
    remitente_monto: [this.data?.remitente_monto, [Validators.min(0)]],
    remitente_moneda: this.data?.remitente_moneda,
    // FIN Monto a cobrar al Remitente
  });

  cobroARemitenteSubscription = this.cobroARemitenteControl.valueChanges.subscribe(val => {
    if (val) {
      this.form.controls['remitente_monto'].setValidators(Validators.required);
      this.form.controls['remitente_moneda'].setValidators(Validators.required);
    } else {
      this.form.controls['remitente_monto'].removeValidators(Validators.required);
      this.form.controls['remitente_moneda'].removeValidators(Validators.required);
    }
    this.form.controls['remitente_moneda'].updateValueAndValidity();
    this.form.controls['remitente_monto'].updateValueAndValidity();
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear'
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
    public dialogRef: MatDialogRef<ComplementoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data?: FleteComplemento,
  ) { }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = JSON.parse(JSON.stringify(this.form.value));
      const concepto: TipoConceptoComplemento = value.concepto;
      const propietarioMoneda: Moneda = value.propietario_moneda;
      const remitenteMoneda: Moneda | null = value.remitente_moneda;
      const data: FleteComplemento = {
        id: this.data?.id,
        concepto_id: concepto.id,
        concepto,
        concepto_descripcion: concepto.descripcion,
        detalle: value.detalle,
        anticipado: value.anticipado,
        // INICIO Monto a pagar al Propietario
        propietario_monto: value.propietario_monto,
        propietario_moneda_id: propietarioMoneda.id,
        propietario_moneda: propietarioMoneda,
        propietario_moneda_nombre: propietarioMoneda.nombre,
        // FIN Monto a pagar al Propietario
        // INICIO Monto a cobrar al Remitente
        habilitar_cobro_remitente: value.habilitar_cobro_remitente,
        remitente_monto: value.remitente_monto,
        remitente_moneda_id: remitenteMoneda?.id,
        remitente_moneda: remitenteMoneda,
        remitente_moneda_nombre: remitenteMoneda?.nombre,
        // FIN Monto a cobrar al Remitente
        flete_id: this.data?.flete_id,
      }
      this.dialogRef.close(data);
    }
  }

  valueMoneda(item: Moneda): Moneda {
    return item;
  }
}
