import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcDescuentoDialogData } from 'src/app/interfaces/oc-descuento-dialog-data';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { OrdenCargaDescuentoService } from 'src/app/services/orden-carga-descuento.service';

@Component({
  selector: 'app-oc-descuento-form-dialog',
  templateUrl: './oc-descuento-form-dialog.component.html',
  styleUrls: ['./oc-descuento-form-dialog.component.scss'],
})
export class OcDescuentoFormDialogComponent {
  form = this.fb.group({
    concepto_id: [this.data?.concepto_id, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a cobrar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_moneda_id: [
      this.data?.propietario_moneda_id,
      Validators.required,
    ],
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    habilitar_pago_proveedor: this.data?.habilitar_pago_proveedor,
    proveedor_monto: [this.data?.proveedor_monto, [Validators.min(0)]],
    proveedor_moneda_id: this.data?.proveedor_moneda_id,
    proveedor_id: this.data?.proveedor_id,
    // FIN Monto a pagar al Proveedor
  });

  pagoAProveedorSubscription =
    this.pagoAProveedorControl.valueChanges.subscribe((val) => {
      if (val) {
        this.form.controls['proveedor_monto'].setValidators(
          Validators.required
        );
        this.form.controls['proveedor_moneda_id'].setValidators(
          Validators.required
        );
        this.form.controls['proveedor_id'].setValidators(Validators.required);
      } else {
        this.form.controls['proveedor_monto'].removeValidators(
          Validators.required
        );
        this.form.controls['proveedor_moneda_id'].removeValidators(
          Validators.required
        );
        this.form.controls['proveedor_id'].removeValidators(
          Validators.required
        );
      }
      this.form.controls['proveedor_moneda_id'].updateValueAndValidity();
      this.form.controls['proveedor_monto'].updateValueAndValidity();
      this.form.controls['proveedor_id'].updateValueAndValidity();
    });

  get data(): OrdenCargaDescuento | undefined {
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

  get pagoAProveedorControl(): FormControl {
    return this.form.get('habilitar_pago_proveedor') as FormControl;
  }

  get pagoAProveedor(): boolean {
    return this.pagoAProveedorControl.value;
  }

  constructor(
    private ordenCargaDescuentoService: OrdenCargaDescuentoService,
    public dialogRef: MatDialogRef<OcDescuentoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcDescuentoDialogData
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
        this.ordenCargaDescuentoService
          .edit(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.ordenCargaDescuentoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: OrdenCargaDescuento): void {
    this.dialogRef.close(data);
  }
}
