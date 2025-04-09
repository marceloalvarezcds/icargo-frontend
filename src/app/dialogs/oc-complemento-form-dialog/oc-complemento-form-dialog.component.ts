import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Moneda } from 'src/app/interfaces/moneda';
import { OcComplementoDialogData } from 'src/app/interfaces/oc-complemento-dialog-data';
import { OrdenCargaComplemento } from 'src/app/interfaces/orden-carga-complemento';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { OrdenCargaComplementoService } from 'src/app/services/orden-carga-complemento.service';

@Component({
  selector: 'app-oc-complemento-form-dialog',
  templateUrl: './oc-complemento-form-dialog.component.html',
  styleUrls: ['./oc-complemento-form-dialog.component.scss'],
})
export class OcComplementoFormDialogComponent implements OnInit {
  cotizacionOrigenPropietario: number | null = null;
  cotizacionDestino: number | null = null;
  cotizacionOrigenRemitente: number | null = null;
  cotizacionDestinoRemitente: number | null = null;
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
    propietario_moneda: [this.data?.propietario_moneda, Validators.required],
    // FIN Monto a pagar al Propietario
    remitente_monto_ml: [null],
    // INICIO Monto a cobrar al Remitente
    habilitar_cobro_remitente: this.data?.habilitar_cobro_remitente,
    remitente_monto: [this.data?.remitente_monto, [Validators.min(0)]],
    remitente_moneda: [this.data?.remitente_moneda],
    propietario_monto_ml: [null],
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

  ngOnInit(): void {
    this.getCotizacionMonedaDestinoPropietario()
  }

  getCotizacionMonedaOrigenPropietario(monedaOrigen: number): void {
  this.monedaCotizacionService
    .getCotizacionByGestor(monedaOrigen, this.dialogData?.oc!.gestor_carga_id)
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
      .getCotizacionByGestor(monedaOrigenRemitente, this.dialogData?.oc!.gestor_carga_id)
      .subscribe({
        next: (responseOrigen) => {
          this.cotizacionOrigenRemitente = responseOrigen ? responseOrigen.cotizacion_moneda : null;
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
        this.getCotizacionMonedaOrigenRemitente(monedaOrigenRemitente);
      }
    }


  get data(): OrdenCargaComplemento | undefined {
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
    private monedaCotizacionService: MonedaCotizacionService,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcComplementoDialogData
  ) {}


  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formValue = this.form.value;

      const propietarioMonto = formValue.propietario_monto;
      const remitenteMonto = formValue.remitente_monto;

      this.propietario_monto_ml = (propietarioMonto * this.cotizacionOrigenPropietario!) / this.cotizacionDestino!;
      this.remitente_monto_ml = (remitenteMonto * this.cotizacionOrigenRemitente!) / this.cotizacionDestino!;

        const data = {
          concepto: formValue.concepto,
          detalle: formValue.detalle,
          habilitar_cobro_remitente: formValue.habilitar_cobro_remitente,
          anticipado: formValue.anticipado,
          propietario_monto: propietarioMonto,
          propietario_monto_ml: this.propietario_monto_ml,
          propietario_moneda: formValue.propietario_moneda,
          remitente_monto: remitenteMonto,
          remitente_monto_ml: this.remitente_monto_ml,
          remitente_moneda: formValue.remitente_moneda,
          orden_carga_id: this.dialogData.orden_carga_id,
          flete_id: this.data?.flete_id,
          id: this.data?.id,
        };
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        const action = this.data?.id
          ? this.ordenCargaComplementoService.edit(this.data.id, formData)
          : this.ordenCargaComplementoService.create(formData);

        action.subscribe(this.close.bind(this));
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
