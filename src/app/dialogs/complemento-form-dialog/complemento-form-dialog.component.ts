import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FleteComplemento } from 'src/app/interfaces/flete-complemento';
import { Moneda } from 'src/app/interfaces/moneda';
import { TipoConceptoComplemento } from 'src/app/interfaces/tipo-concepto-complemento';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-complemento-form-dialog',
  templateUrl: './complemento-form-dialog.component.html',
  styleUrls: ['./complemento-form-dialog.component.scss'],
})
export class ComplementoFormDialogComponent implements OnInit {
  cotizacionOrigenPropietario: number | null = null;
  cotizacionDestino: number | null = null;
  cotizacionOrigenRemitente: number | null = null;
  cotizacionDestinoRemitente: number | null = null;
  gestorCargaId: number | null = null;
  monedaDestinoId: number | null = null;
  propietario_monto_ml = 0
  remitente_monto_ml: number | null = null;

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
    propietario_moneda_id: [this.data?.propietario_moneda_id, Validators.required],
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    habilitar_cobro_remitente: this.data?.habilitar_cobro_remitente,
    remitente_monto: [this.data?.remitente_monto, [Validators.min(0)]],
    remitente_monto_ml: [null],
    remitente_moneda_id: this.data?.remitente_moneda_id,
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

    ngOnInit(): void {
      // Llamar a getLoggedUser() para obtener los datos del usuario logueado
      this.userService.getLoggedUser().subscribe((user) => {
        this.gestorCargaId = user.gestor_carga_id;

        this.monedaService.getMonedaByGestorId(this.gestorCargaId!).subscribe((moneda) => {
          this.monedaDestinoId = moneda?.id ?? null;

          this.monedaCotizacionService
            .getCotizacionByGestor(this.monedaDestinoId!, this.gestorCargaId!)
            .subscribe((responseDestino) => {
              this.cotizacionDestino = responseDestino?.cotizacion_moneda ?? null;

              console.log('Cotización destino cargada:', this.cotizacionDestino);
            });
        });
      });
    }

    getMonedaByGestor(): void {
      if (this.gestorCargaId) {
        this.monedaService.getMonedaByGestorId(this.gestorCargaId!).subscribe(
          (response) => {
            this.monedaDestinoId = response?.id ?? null;
            console.log('monedaDestinoId:', this.monedaDestinoId);
            console.log('gestorCargaId:', this.gestorCargaId);

          }
        );
      }
    }

  getCotizacionMonedaOrigenPropietario(monedaOrigen: number): void {
    this.monedaCotizacionService
      .getCotizacionByGestor(monedaOrigen, this.gestorCargaId!)
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
      .getCotizacionByGestor(monedaOrigenRemitente, this.gestorCargaId!)
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
      .getCotizacionByGestor(this.monedaDestinoId!, this.gestorCargaId!)
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
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private data?: FleteComplemento
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const propietarioMonto = this.form.value.propietario_monto;
      const remitenteMonto = this.form.value.remitente_monto;

      // console.log('propietarioMonto:', propietarioMonto);
      // console.log('remitenteMonto:', remitenteMonto);
      // console.log('cotizacionOrigenPropietario:', this.cotizacionOrigenPropietario);
      // console.log('cotizacionOrigenRemitente:', this.cotizacionOrigenRemitente);
      // console.log('cotizacionDestino:', this.cotizacionDestino);

      this.propietario_monto_ml = Math.round(
        (propietarioMonto * this.cotizacionOrigenPropietario!) / this.cotizacionDestino!
      );

      if (remitenteMonto != null && this.cotizacionOrigenRemitente != null && this.cotizacionDestino != null) {
        this.remitente_monto_ml = Math.round(
          (remitenteMonto * this.cotizacionOrigenRemitente) / this.cotizacionDestino
        );
      } else {
        this.remitente_monto_ml = null;
      }


      console.log('this.propietario_monto_ml calculado:', this.propietario_monto_ml);
      console.log('this.remitente_monto_ml calculado:', this.remitente_monto_ml);

      const value = JSON.parse(JSON.stringify(this.form.value));
      const concepto: TipoConceptoComplemento = value.concepto;

      const data: FleteComplemento = {
        id: this.data?.id,
        concepto_id: concepto.id,
        concepto,
        concepto_descripcion: concepto.descripcion,
        detalle: value.detalle,
        anticipado: value.anticipado,

        // Monto Propietario
        propietario_monto: value.propietario_monto,
        propietario_monto_ml: this.propietario_monto_ml,
        propietario_moneda_id: value.propietario_moneda_id,
        propietario_moneda: this.propietarioMoneda!,
        propietario_moneda_nombre: this.propietarioMoneda!.nombre,

        // Monto Remitente
        habilitar_cobro_remitente: value.habilitar_cobro_remitente,
        remitente_monto: value.remitente_monto,
        remitente_monto_ml: this.remitente_monto_ml,
        remitente_moneda_id: value.remitente_moneda_id,
        remitente_moneda: this.remitenteMoneda,
        remitente_moneda_nombre: this.remitenteMoneda?.nombre,

        flete_id: this.data?.flete_id,
      };

      console.log('Datos que se envían al cerrar el diálogo:', data);
      console.log('cotizacionOrigenPropietario:', this.cotizacionOrigenPropietario);
      console.log('cotizacionDestino:', this.cotizacionDestino);
      this.dialogRef.close(data);
    }
  }


  valueConcepto(item: TipoConceptoComplemento): TipoConceptoComplemento {
    return item;
  }

  onSelectMonedaPropietario(moneda:Moneda){
    this.propietarioMoneda = moneda;
    if (moneda && moneda.id) {
      this.getCotizacionMonedaOrigenPropietario(moneda.id);
    }
  }

  onSelectMonedaRemitente(moneda:Moneda){
    this.remitenteMoneda = moneda;
    if (moneda && moneda.id) {
      this.getCotizacionMonedaOrigenRemitente(moneda.id);
    }
  }

  /*valueMoneda(item: Moneda): Moneda {
    return item;
  }*/
}
