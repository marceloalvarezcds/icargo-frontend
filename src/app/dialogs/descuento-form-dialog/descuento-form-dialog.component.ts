import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FleteDescuento } from 'src/app/interfaces/flete-descuento';
import { Moneda } from 'src/app/interfaces/moneda';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { TipoConceptoDescuento } from 'src/app/interfaces/tipo-concepto-descuento';

@Component({
  selector: 'app-descuento-form-dialog',
  templateUrl: './descuento-form-dialog.component.html',
  styleUrls: ['./descuento-form-dialog.component.scss'],
})
export class DescuentoFormDialogComponent {
  form = this.fb.group({
    concepto: [this.data?.concepto, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a cobrar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_moneda: [this.data?.propietario_moneda, Validators.required],
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    habilitar_pago_proveedor: this.data?.habilitar_pago_proveedor,
    proveedor_monto: [this.data?.proveedor_monto, [Validators.min(0)]],
    proveedor_moneda: this.data?.proveedor_moneda,
    proveedor: this.data?.proveedor,
    // FIN Monto a pagar al Proveedor
  });

  pagoAProveedorSubscription =
    this.pagoAProveedorControl.valueChanges.subscribe((val) => {
      if (val) {
        this.form.controls['proveedor_monto'].setValidators(
          Validators.required
        );
        this.form.controls['proveedor_moneda'].setValidators(
          Validators.required
        );
        this.form.controls['proveedor'].setValidators(Validators.required);
      } else {
        this.form.controls['proveedor_monto'].removeValidators(
          Validators.required
        );
        this.form.controls['proveedor_moneda'].removeValidators(
          Validators.required
        );
        this.form.controls['proveedor'].removeValidators(Validators.required);
      }
      this.form.controls['proveedor_moneda'].updateValueAndValidity();
      this.form.controls['proveedor_monto'].updateValueAndValidity();
      this.form.controls['proveedor'].updateValueAndValidity();
    });

  get actionText(): string {
    return this.data ? 'EDITAR' : 'NUEVO';
  }

  get anticipadoControl(): FormControl {
    return this.form.get('anticipado') as FormControl;
  }

  get anticipado(): boolean {
    return this.anticipadoControl.value;
  }

  get pagoAProveedorControl(): FormControl {
    return this.form.get('habilitar_pago_proveedor') as FormControl;
  }

  get pagoAProveedor(): boolean {
    return this.pagoAProveedorControl.value;
  }

  constructor(
    public dialogRef: MatDialogRef<DescuentoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data?: FleteDescuento
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const value = JSON.parse(JSON.stringify(this.form.value));
      const concepto: TipoConceptoDescuento = value.concepto;
      const propietarioMoneda: Moneda = value.propietario_moneda;
      const proveedorMoneda: Moneda | null = value.proveedor_moneda;
      const proveedor: Proveedor | null = value.proveedor;
      const data: FleteDescuento = {
        id: this.data?.id,
        concepto_id: concepto.id,
        concepto,
        concepto_descripcion: concepto.descripcion,
        detalle: value.detalle,
        anticipado: value.anticipado,
        // INICIO Monto a cobrar al Propietario
        propietario_monto: value.propietario_monto,
        propietario_moneda_id: propietarioMoneda.id,
        propietario_moneda: propietarioMoneda,
        propietario_moneda_nombre: propietarioMoneda.nombre,
        // FIN Monto a cobrar al Propietario
        // INICIO Monto a pagar al Proveedor
        habilitar_pago_proveedor: value.habilitar_pago_proveedor,
        proveedor_monto: value.proveedor_monto,
        proveedor_moneda_id: proveedorMoneda?.id,
        proveedor_moneda: proveedorMoneda,
        proveedor_moneda_nombre: proveedorMoneda?.nombre,
        proveedor_id: proveedor?.id,
        proveedor: proveedor,
        proveedor_nombre: proveedor?.nombre,
        // FIN Monto a pagar al Proveedor
        flete_id: this.data?.flete_id,
      };
      this.dialogRef.close(data);
    }
  }

  valueConcepto(item: TipoConceptoDescuento): TipoConceptoDescuento {
    return item;
  }

  valueMoneda(item: Moneda): Moneda {
    return item;
  }

  valueProveedor(item: Proveedor): Proveedor {
    return item;
  }
}
