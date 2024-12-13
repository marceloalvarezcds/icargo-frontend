import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InstrumentoViaEnum } from 'src/app/enums/instrumento-via';
import { Banco } from 'src/app/interfaces/banco';
import { Caja } from 'src/app/interfaces/caja';
import { InstrumentoLiquidacionItem } from 'src/app/interfaces/instrumento';
import { InstrumentoFormDialogData } from 'src/app/interfaces/instrumento-form-dialog-data';
import { InstrumentoVia } from 'src/app/interfaces/instrumento-via';
import { TipoInstrumento } from 'src/app/interfaces/tipo-instrumento';
import { subtract } from 'src/app/utils/math';

import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Component({
  selector: 'app-instrumento-form-dialog',
  templateUrl: './instrumento-form-dialog.component.html',
  styleUrls: ['./instrumento-form-dialog.component.scss'],
})
export class InstrumentoFormDialogComponent implements OnDestroy {
  banco?: Banco;
  caja?: Caja;
  via?: InstrumentoVia;
  tipoInstrumento?: TipoInstrumento;
  form = this.fb.group({
    via_id: [this.data?.via_id, Validators.required],
    caja_id: this.data?.caja_id,
    banco_id: this.data?.banco_id,
    monto: [
      this.data?.monto ? this.data.monto : this.residuo,
      [Validators.required, Validators.max(this.residuo)],
    ],
    fecha_instrumento: [
      this.data?.fecha_instrumento ?? new Date().toJSON(),
      Validators.required,
    ],
    numero_referencia: this.data?.numero_referencia,
    comentario: this.data?.comentario,
    numero_documento: this.data?.numero_documento,
    moneda_id: [this.data?.moneda_id, [Validators.required] ],
    // Datos mostrados solo para Banco
    tipo_instrumento_id: [{value: this.data?.tipo_instrumento_id, disabled: true}],
    // Solo para cheque
    cheque_es_diferido: this.data?.cheque_es_diferido ?? false,
    cheque_fecha_vencimiento: this.data?.cheque_fecha_vencimiento,
  });

  chequeEsDiferidoSubscription =
    this.chequeEsDiferidoControl.valueChanges.subscribe((val) => {
      if (val) {
        this.form.controls['cheque_fecha_vencimiento'].setValidators(
          Validators.required
        );
      } else {
        this.form.controls['cheque_fecha_vencimiento'].removeValidators(
          Validators.required
        );
      }
      this.form.controls['cheque_fecha_vencimiento'].updateValueAndValidity();
    });

  viaSubscription = this.viaControl.valueChanges.subscribe(() => {
    setTimeout(() => {
      if (this.esBanco) {
        this.form.controls['numero_referencia'].setValidators(
          Validators.required
        );
        this.form.controls['banco_id'].setValidators(Validators.required);
        this.form.controls['caja_id'].removeValidators(Validators.required);
        this.form.controls['tipo_instrumento_id'].enable();
        this.form.controls['tipo_instrumento_id'].setValidators(Validators.required);
      } else {
        this.form.controls['tipo_instrumento_id'].disable();
        this.form.controls['numero_referencia'].removeValidators(
          Validators.required
        );
        this.form.controls['tipo_instrumento_id'].removeValidators(Validators.required);
        this.form.controls['banco_id'].removeValidators(Validators.required);
        this.form.controls['caja_id'].setValidators(Validators.required);
      }
      this.form.controls['numero_referencia'].updateValueAndValidity();
      this.form.controls['banco_id'].updateValueAndValidity();
      this.form.controls['caja_id'].updateValueAndValidity();
      this.form.controls['tipo_instrumento_id'].updateValueAndValidity();
    }, 500);
  });

  get data(): InstrumentoLiquidacionItem | undefined {
    return this.dialogData?.item;
  }

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get anticipadoControl(): FormControl {
    return this.form.get('anticipado') as FormControl;
  }

  get anticipado(): boolean {
    return this.anticipadoControl.value;
  }

  get chequeEsDiferidoControl(): FormControl {
    return this.form.get('cheque_es_diferido') as FormControl;
  }

  get chequeEsDiferido(): boolean {
    return this.chequeEsDiferidoControl.value;
  }

  get esBanco(): boolean {
    return this.via?.descripcion === InstrumentoViaEnum.BANCO;
  }

  get esCobro(): boolean {
    return this.dialogData.es_cobro;
  }

  get monto(): number {
    return parseInt(this.montoControl.value, 10);
  }

  get montoControl(): FormControl {
    return this.form.get('monto') as FormControl;
  }

  get montoHint(): string {
    if (this.monto) {
      return `Residuo <strong>${subtract(
        this.residuo,
        this.monto
      ).toLocaleString()}</strong>`;
    }
    return `Residuo: <strong>${ numberWithCommas(this.residuo)}</strong>`;
  }

  get residuo(): number {
    return this.dialogData.residuo;
  }

  get esTipoCheque(): boolean {
    return this.tipoInstrumento?.descripcion === 'Cheque';
  }

  get viaControl(): FormControl {
    return this.form.get('via_id') as FormControl;
  }

  constructor(
    public dialogRef: MatDialogRef<InstrumentoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: InstrumentoFormDialogData
  ) {}

  ngOnDestroy(): void {
    this.chequeEsDiferidoSubscription.unsubscribe();
    this.viaSubscription.unsubscribe();
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const cuentaDescripcion = `${
        this.esBanco
          ? this.banco?.nombre +
            ' (' +
            this.banco?.titular +
            ' - ' +
            this.banco?.numero_cuenta +
            ')'
          : this.caja?.nombre
      }`;
      const data: InstrumentoLiquidacionItem = {
        ...this.form.value,
        via_descripcion: this.via?.descripcion ?? '',
        cuenta_descripcion: cuentaDescripcion,
        tipo_instrumento_descripcion:
          this.tipoInstrumento?.descripcion ?? 'Efectivo',
      };
      this.dialogRef.close(data);
    }
  }

  setTipoInstrumento(tipo: TipoInstrumento): void {
    this.tipoInstrumento = tipo;
    if (tipo && tipo.descripcion !== 'Cheque') {
      this.chequeEsDiferidoControl.setValue(false);
    }
  }
}
