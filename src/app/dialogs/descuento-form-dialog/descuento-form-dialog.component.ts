import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FleteDescuento } from 'src/app/interfaces/flete-descuento';
import { Moneda } from 'src/app/interfaces/moneda';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { TipoConceptoDescuento } from 'src/app/interfaces/tipo-concepto-descuento';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-descuento-form-dialog',
  templateUrl: './descuento-form-dialog.component.html',
  styleUrls: ['./descuento-form-dialog.component.scss'],
})
export class DescuentoFormDialogComponent implements OnInit{
  cotizacionOrigenPropietario: number | null = null;
  cotizacionDestino: number | null = null;
  cotizacionOrigenRemitente: number | null = null;
  cotizacionDestinoRemitente: number | null = null;
  gestorCargaId: number | null = null;
  monedaDestinoId: number | null = null;
  propietario_monto_ml = 0
  proveedor_monto_ml: number | null = null;

  form = this.fb.group({
    concepto: [this.data?.concepto, Validators.required],
    detalle: this.data?.detalle,
    anticipado: this.data?.anticipado,
    // INICIO Monto a cobrar al Propietario
    propietario_monto: [
      this.data?.propietario_monto,
      [Validators.required, Validators.min(0)],
    ],
    propietario_monto_ml:[null],
    propietario_moneda_id: [this.data?.propietario_moneda_id, Validators.required],
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    habilitar_pago_proveedor: this.data?.habilitar_pago_proveedor,
    proveedor_monto: [this.data?.proveedor_monto, [Validators.min(0)]],
    proveedor_monto_ml:[null],
    proveedor_moneda_id: this.data?.proveedor_moneda_id,
    proveedor: this.data?.proveedor,
    // FIN Monto a pagar al Proveedor
  });

  propietarioMoneda?:Moneda;
  proveedorMoneda?:Moneda;

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

  getCotizacionMonedaOrigenProveedor(monedaOrigenRemitente: number): void {
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
    private userService: UserService,
    private monedaService: MonedaService,
    private monedaCotizacionService: MonedaCotizacionService,
    @Inject(MAT_DIALOG_DATA) private data?: FleteDescuento
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {

      const propietarioMonto = this.form.value.propietario_monto;
      const proveedorMonto = this.form.value.proveedor_monto;

      // console.log('propietarioMonto:', propietarioMonto);
      // console.log('remitenteMonto:', proveedorMonto);
      // console.log('cotizacionOrigenPropietario:', this.cotizacionOrigenPropietario);
      // console.log('cotizacionOrigenRemitente:', this.cotizacionOrigenRemitente);
      // console.log('cotizacionDestino:', this.cotizacionDestino);
      this.propietario_monto_ml = Math.round((propietarioMonto * this.cotizacionOrigenPropietario!) / this.cotizacionDestino!);
      if (proveedorMonto != null && this.cotizacionOrigenRemitente != null && this.cotizacionDestino != null) {
        this.proveedor_monto_ml = Math.round((proveedorMonto * this.cotizacionOrigenRemitente) / this.cotizacionDestino);
      } else {
        this.proveedor_monto_ml = null;
      }

      console.log('this.propietario_monto_ml calculado:', this.propietario_monto_ml);
      console.log('this.proveedor_monto_ml calculado:', this.proveedor_monto_ml);

      const value = JSON.parse(JSON.stringify(this.form.value));
      const concepto: TipoConceptoDescuento = value.concepto;
      //const propietarioMoneda: Moneda = value.propietario_moneda;
      //const proveedorMoneda: Moneda | null = value.proveedor_moneda;
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
        propietario_monto_ml: this.propietario_monto_ml,
        propietario_moneda_id: value.propietario_moneda_id,
        propietario_moneda: this.propietarioMoneda!,
        propietario_moneda_nombre: this.propietarioMoneda!.nombre,
        // FIN Monto a cobrar al Propietario
        // INICIO Monto a pagar al Proveedor
        habilitar_pago_proveedor: value.habilitar_pago_proveedor,
        proveedor_monto: value.proveedor_monto,
        proveedor_monto_ml: this.proveedor_monto_ml,
        proveedor_moneda_id: value.proveedor_moneda_id,
        proveedor_moneda: this.proveedorMoneda,
        proveedor_moneda_nombre: this.proveedorMoneda?.nombre,
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

  onSelectMonedaPropietario(moneda:Moneda){
    this.propietarioMoneda = moneda;
    if (moneda && moneda.id) {
      this.getCotizacionMonedaOrigenPropietario(moneda.id);
    }
  }

  onSelectMonedaProveedor(moneda: Moneda): void {
    this.proveedorMoneda = moneda;

    if (moneda && moneda.id) {
      this.getCotizacionMonedaOrigenProveedor(moneda.id);
    }
  }

}
