import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OcDescuentoDialogData } from 'src/app/interfaces/oc-descuento-dialog-data';
import { OrdenCargaDescuento } from 'src/app/interfaces/orden-carga-descuento';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { OrdenCargaDescuentoService } from 'src/app/services/orden-carga-descuento.service';

@Component({
  selector: 'app-oc-descuento-form-dialog',
  templateUrl: './oc-descuento-form-dialog.component.html',
  styleUrls: ['./oc-descuento-form-dialog.component.scss'],
})
export class OcDescuentoFormDialogComponent implements OnInit {
  cotizacionOrigenPropietario: number | null = null;
  cotizacionDestino: number | null = null;
  cotizacionOrigenProveedor: number | null = null;
  cotizacionDestinoRemitente: number | null = null;
  propietario_monto_ml = 0
  proveedor_monto_ml = 0
  form = this.fb.group({
    concepto_id: [this.data?.concepto_id, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a cobrar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_monto_ml: [null],
    propietario_moneda_id: [
      this.data?.propietario_moneda_id,
      Validators.required,
    ],
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    habilitar_pago_proveedor: this.data?.habilitar_pago_proveedor,
    proveedor_monto: [this.data?.proveedor_monto, [Validators.min(0)]],
    proveedor_monto_ml: [null],
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

    ngOnInit(): void {
      this.getCotizacionMonedaDestinoPropietario()
    }

    getCotizacionMonedaOrigenPropietario(monedaOrigen: number): void {
      this.monedaCotizacionService
        .getCotizacionByGestor(monedaOrigen, this.dialogData?.oc!.gestor_carga_id)
        .subscribe({
          next: (responseOrigen) => {
            this.cotizacionOrigenPropietario = responseOrigen ? responseOrigen.cotizacion_moneda : null;
            console.log('this.cotizacionOrigenPropietario', this.cotizacionOrigenPropietario)
          },
          error: (err) => {
            console.error('Error al obtener cotización para moneda origen:', err);
          }
        });
    }

    getCotizacionMonedaOrigenProveedor(monedaOrigenRemitente: number): void {
      this.monedaCotizacionService
        .getCotizacionByGestor(monedaOrigenRemitente, this.dialogData?.oc!.gestor_carga_id)
        .subscribe({
          next: (responseOrigen) => {
            this.cotizacionOrigenProveedor = responseOrigen ? responseOrigen.cotizacion_moneda : null;
            console.log('this.cotizacionOrigenProveedor', this.cotizacionOrigenProveedor)
          },
          error: (err) => {
            console.error('Error al obtener cotización para moneda origen:', err);
          }
        });
    }


    getCotizacionMonedaDestinoPropietario(): void {
      this.monedaCotizacionService
        .getCotizacionByGestor(this.dialogData.oc!.gestor_carga_moneda_id, this.dialogData.oc!.gestor_carga_id)
        .subscribe({
          next: (responseDestino) => {
            this.cotizacionDestino = responseDestino?.cotizacion_moneda ?? null;
            console.log('this.cotizacionDestino', this.cotizacionDestino)
          },
          error: (err) => {
            console.error('Error al obtener cotización de moneda destino:', err);
          }
        });
    }

      onMonedaOrigenPropietarioChange(monedaDestino: any): void {
        if (monedaDestino) {
          const monedaOrigen = monedaDestino.id;
          this.getCotizacionMonedaOrigenPropietario(monedaOrigen);
        }
      }

      onMonedaOrigenRemitenteChange(monedaDestino: any): void {
        if (monedaDestino) {
          const monedaOrigenRemitente = monedaDestino.id;
          this.getCotizacionMonedaOrigenProveedor(monedaOrigenRemitente);
        }
      }


  get data(): OrdenCargaDescuento | undefined {
    return this.dialogData?.item;
  }

  get condicionMonedaRemitente(): string {
    return this.dialogData.oc?.condicion_gestor_moneda_simbolo ?? ''
  }

  get condicionMonedaPropietario(): string {
    return this.dialogData.oc?.condicion_propietario_moneda_simbolo ?? ''
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
    private monedaCotizacionService: MonedaCotizacionService,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcDescuentoDialogData
  ) {}

    submit(): void {
      // Marca el formulario como sucio y tocado para mostrar los errores de validación
      this.form.markAsDirty();
      this.form.markAllAsTouched();

      if (this.form.valid) {
          const formValue = this.form.value;

          // Obtener los montos de propietario y proveedor desde el formulario
          const propietarioMonto = formValue.propietario_monto;
          const proveedorMonto = formValue.proveedor_monto;

          console.log('propietarioMonto', propietarioMonto);
          console.log('proveedorMonto', proveedorMonto);

          // Calcular el monto en moneda local para el propietario y proveedor
          this.propietario_monto_ml = (propietarioMonto * this.cotizacionOrigenPropietario!) / this.cotizacionDestino!;
          this.proveedor_monto_ml = (proveedorMonto * this.cotizacionOrigenProveedor!) / this.cotizacionDestino!;

          console.log('this.propietario_monto_ml', this.propietario_monto_ml);
          console.log('this.proveedor_monto_ml', this.proveedor_monto_ml);

          const data = JSON.parse(
              JSON.stringify({
                  ...this.form.value,
                  propietario_monto_ml: this.propietario_monto_ml,
                  proveedor_monto_ml: this.proveedor_monto_ml,
                  id: this.data?.id,
                  flete_id: this.data?.flete_id,
                  orden_carga_id: this.dialogData.orden_carga_id,
                  propietario_moneda_id: formValue.propietario_moneda_id?.id,
                  proveedor_moneda_id: formValue.proveedor_moneda_id?.id,
              })
          );
          const formData = new FormData();
          formData.append('data', JSON.stringify(data));
          const action = this.data?.id
              ? this.ordenCargaDescuentoService.edit(this.data.id, formData)
              : this.ordenCargaDescuentoService.create(formData);
          action.subscribe(this.close.bind(this));
      }
  }


  private close(data: OrdenCargaDescuento): void {
    this.dialogRef.close(data);
  }
}
