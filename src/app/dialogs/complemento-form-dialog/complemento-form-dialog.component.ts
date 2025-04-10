import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { Moneda } from 'src/app/interfaces/moneda';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';

@Component({
  selector: 'app-complemento-form-dialog',
  templateUrl: './complemento-form-dialog.component.html',
  styleUrls: ['./complemento-form-dialog.component.scss'],
})
export class ComplementoFormDialogComponent {
  cotizacionOrigenPropietario: number | null = null;
  cotizacionDestino: number | null = null;
  cotizacionOrigenRemitente: number | null = null;
  cotizacionDestinoRemitente: number | null = null;
  monedaDestinoId: number | null = null;
  propietario_monto_ml = 0
  remitente_monto_ml = 0
  form = this.fb.group({
    concepto: [this.data?.concepto, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a pagar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_monto_ml:[null],
    propietario_moneda: [this.data?.propietario_moneda, Validators.required],
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    habilitar_cobro_remitente: this.data?.habilitar_cobro_remitente,
    remitente_monto: [this.data?.remitente_monto, [Validators.min(0)]],
    remitente_monto_ml: [null],
    remitente_moneda: this.data?.remitente_moneda,
    // FIN Monto a cobrar al Remitente
  });

  propietarioMoneda?:Moneda;
  remitenteMoneda?:Moneda;

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

    getMonedaByGestor(): void {
      if (this.data?.flete_gestor_carga_id!) {
        this.monedaService.getMonedaByGestorId(this.data?.flete_gestor_carga_id!).subscribe(
          (response) => {
            this.monedaDestinoId = response?.id ?? null;
          }
        );
      }
    }

  getCotizacionMonedaOrigenPropietario(monedaOrigen: number): void {
    this.monedaCotizacionService
      .getCotizacionByGestor(monedaOrigen, this.data?.flete_gestor_carga_id!)
      .subscribe({
        next: (responseOrigen) => {
          this.cotizacionOrigenPropietario = responseOrigen ? responseOrigen.cotizacion_moneda : null;
        },
        error: (err) => {
          console.error('Error al obtener cotización para moneda origen:', err);
        }
      });
    }

  getCotizacionMonedaOrigenRemitente(monedaOrigenRemitente: number): void {
    this.monedaCotizacionService
      .getCotizacionByGestor(monedaOrigenRemitente, this.data?.flete_gestor_carga_id!)
      .subscribe({
        next: (responseOrigen) => {
          this.cotizacionOrigenRemitente = responseOrigen ? responseOrigen.cotizacion_moneda : null;
        },
        error: (err) => {
          console.error('Error al obtener cotización para moneda origen:', err);
        }
      });
    }

  getCotizacionMonedaDestino(): void {
    this.monedaCotizacionService
      .getCotizacionByGestor(this.data?.flete_gestor_carga_id!, this.data?.flete_gestor_carga_id!)
      .subscribe({
        next: (responseDestino) => {
          this.cotizacionDestino = responseDestino?.cotizacion_moneda ?? null;
        },
        error: (err) => {
          console.error('Error al obtener cotización de moneda destino:', err);
        }
      });
    }

  onMonedaOrigenPropietarioChange(monedaOrigen: any): void {
      if (monedaOrigen) {
        const monedaId = monedaOrigen.id;
        this.getCotizacionMonedaOrigenPropietario(monedaId);
      }
    }

  onMonedaOrigenRemitenteChange(monedaOrigen: any): void {
    if (monedaOrigen) {
      const monedaId = monedaOrigen.id;
      this.getCotizacionMonedaOrigenRemitente(monedaId);
    }
  }

  get actionText(): string {
    return this.data ? 'EDITAR' : 'NUEVO';
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
    private monedaService: MonedaService,
    private monedaCotizacionService: MonedaCotizacionService,
    @Inject(MAT_DIALOG_DATA) private data?: FleteComplemento
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const propietarioMonto = this.form.value.propietario_monto;
      const remitenteMonto = this.form.value.remitente_monto;

      this.propietario_monto_ml = (propietarioMonto * this.cotizacionOrigenPropietario!) / this.cotizacionDestino!;
      this.remitente_monto_ml = (remitenteMonto * this.cotizacionOrigenRemitente!) / this.cotizacionDestino!;

      const value = JSON.parse(JSON.stringify(this.form.value));
      const concepto: TipoConceptoComplemento = value.concepto;
      //const propietarioMoneda: Moneda = value.propietario_moneda;
      //const remitenteMoneda: Moneda | null = value.remitente_moneda;
      const data: FleteComplemento = {
        id: this.data?.id,
        concepto_id: concepto.id,
        concepto,
        concepto_descripcion: concepto.descripcion,
        detalle: value.detalle,
        anticipado: value.anticipado,
        // INICIO Monto a pagar al Propietario
        propietario_monto: value.propietario_monto,
        //propietario_moneda_id: propietarioMoneda.id,
        propietario_moneda_id: value.propietario_moneda,
        propietario_moneda: this.propietarioMoneda!,
        propietario_moneda_nombre: this.propietarioMoneda!.nombre,

        // FIN Monto a pagar al Propietario
        // INICIO Monto a cobrar al Remitente
        habilitar_cobro_remitente: value.habilitar_cobro_remitente,
        remitente_monto: value.remitente_monto,
        remitente_moneda_id: value.remitente_moneda,
        remitente_moneda: this.remitenteMoneda,
        remitente_moneda_nombre: this.remitenteMoneda?.nombre,
        // FIN Monto a cobrar al Remitente
        flete_id: this.data?.flete_id,
        flete_gestor_carga_id: this.data?.flete_gestor_carga_id,
      };
      this.dialogRef.close(data);
    }
  }

  valueConcepto(item: TipoConceptoComplemento): TipoConceptoComplemento {
    return item;
  }

  onSelectMonedaPropietario(moneda:Moneda){
    this.propietarioMoneda = moneda;
  }

  onSelectMonedaRemitente(moneda:Moneda){
    this.remitenteMoneda = moneda;
  }

  /*valueMoneda(item: Moneda): Moneda {
    return item;
  }*/
}
