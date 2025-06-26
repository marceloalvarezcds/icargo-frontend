import { ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoAnticipoEnum } from 'src/app/enums/tipo-anticipo-enum';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { FleteAnticipoService } from 'src/app/services/flete-anticipo.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { OrdenCargaAnticipoSaldoService } from 'src/app/services/orden-carga-anticipo-saldo.service';
import { UserService } from 'src/app/services/user.service';
import { round, roundString, subtract } from 'src/app/utils/math';
import { NumberValidator } from 'src/app/validators/number-validator';

@Component({
  selector: 'app-oc-anticipo-retirado-insumo-dialog',
  templateUrl: './oc-anticipo-retirado-insumo-dialog.component.html',
  styleUrls: ['./oc-anticipo-retirado-insumo-dialog.component.scss']
})
export class OcAnticipoRetiradoInsumoDialogComponent implements OnDestroy, OnInit
{
  @Output() montoRetiradoChange = new EventEmitter<number>();

  fleteAnticipo?: FleteAnticipo;
  insumo?: string;
  moneda?: string;
  monedaSimbolo?: string;
  proveedor?: string;
  tipoInsumo?: string;
  tipoAnticipo?: TipoAnticipo;
  saldoAnticipo = 0;
  simboloMoneda?:string;
  cotizacion?: number = 0
  cotizacionOrigen: number | null = null;
  cotizacionDestino: number | null = null;
  monedaOrigenId: number | null = null;
  monedaDestinoId: number | null = null;
  monto_mon_local = 0
  monto_retirado_cotizacion = 0
  insumoMonedaId: number | null = null;
  gestorCargaId: number | null = null;
  montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
  pdvEventsSubject: Subject<PuntoVentaList> = new Subject<PuntoVentaList>();
  pdvInsumoEventsSubject: Subject<InsumoPuntoVentaPrecioList> = new Subject<InsumoPuntoVentaPrecioList>();

  form = this.fb.group({
    tipo_anticipo_id: [2],
    tipo_insumo_id: this.data?.tipo_insumo_id,
    flete_anticipo_id: [this.data?.flete_anticipo_id, Validators.required],
    proveedor_id: [this.data?.proveedor_id, Validators.required],
    punto_venta_id: [this.data?.punto_venta_id, Validators.required],
    moneda_id: [this.data?.moneda_id ?? 1, Validators.required],
    tipo_comprobante_id: this.data?.tipo_comprobante_id,
    numero_comprobante: this.data?.numero_comprobante,
    monto_retirado: [
      this.data?.monto_retirado,
      [Validators.required, Validators.min(0)],
    ],
    monto_mon_local: [null],
    insumo_id: this.data?.insumo_id,
    insumo_punto_venta_precio_id: this.data?.insumo_punto_venta_precio_id,
    observacion: this.data?.observacion,
    unidad_id: this.data?.unidad_id,
    cantidad_retirada: [this.data?.cantidad_retirada, Validators.min(0)],
    precio_unitario: this.data?.precio_unitario,
    es_con_litro: !!this.data?.cantidad_retirada,
  });

  esConLitroSubscription = this.esConLitroControl.valueChanges.subscribe(
    (esConLitro) => {
      if (esConLitro) {
        const cantidad = this.cantidadControl.value;
        const precio = this.precioUnitarioControl.value;

        if (cantidad && precio) {
          if (this.cotizacionDestino !== null) {

            const montoCalculado = roundString(cantidad) * roundString((precio * this.cotizacionDestino).toString());
            this.montoRetiradoControl.setValue(montoCalculado);
          } else {
            this.montoRetiradoControl.setValue(0);
          }
        } else {
          this.montoRetiradoControl.setValue(0);
        }
      } else {
        this.montoRetiradoControl.setValue(0);
      }
    }
  );

  montoSubscription = combineLatest([
    this.form.controls['monto_retirado'].valueChanges,
    this.precioUnitarioControl.valueChanges,
  ])
    .pipe(map(([m, p]) => [roundString(m), roundString(p)]))
    .subscribe(([monto, precio]) => {
      if (
        this.esConLitroControl.value === false &&
        precio > 0 &&
        this.cotizacionDestino != null
      ) {
        const precioEnMonedaLocal = precio * this.cotizacionDestino!;
        const litrosCalculados = monto / precioEnMonedaLocal;
        this.cantidadControl.setValue(round(litrosCalculados));
      }
    });


  litroSubscription = combineLatest([
    this.form.controls['cantidad_retirada'].valueChanges,
    this.precioUnitarioControl.valueChanges,
  ])
    .pipe(map(([c, p]) => [roundString(c), roundString(p)]))
    .subscribe(([cantidad, precio]) => {
      if (this.esConLitroControl.value === true && precio > 0) {
        if (this.cotizacionDestino !== null) {
          const montoCalculado = cantidad * precio * (this.cotizacionDestino!);
          this.montoRetiradoControl.setValue(round(montoCalculado));
        }
      }
    });

  fleteAnticipoEfectivoSubscription?: Subscription;
  fleteAnticipoInsumoSubscription?: Subscription;

  get actionText(): string {
    return this.data ? 'ANULAR' : 'NUEVO';
  }

  get cantidadControl(): FormControl {
    return this.form.get('cantidad_retirada') as FormControl;
  }

  get data(): OrdenCargaAnticipoRetirado | undefined {
    return this.dialogData?.item;
  }

  get fleteAnticipoId(): number | undefined {
    return this.data?.flete_anticipo_id;
  }

  get fleteAnticipoControl(): FormControl {
    return this.form.get('flete_anticipo_id') as FormControl;
  }

  get fleteId(): number {
    return this.dialogData.flete_id;
  }

  get esConLitro(): boolean {
    return this.esConLitroControl.value;
  }

  get esConLitroControl(): FormControl {
    return this.form.get('es_con_litro') as FormControl;
  }

  get isTipoInsumo(): boolean {
    return this.tipoAnticipo?.descripcion === TipoAnticipoEnum.INSUMOS;
  }

  get insumoControl(): FormControl {
    return this.form.get('insumo_id') as FormControl;
  }

  get insumoId(): number | null {
    return this.insumoControl.value;
  }

  get insumoPuntoVentaPrecioControl(): FormControl {
    return this.form.get('insumo_punto_venta_precio_id') as FormControl;
  }

  get insumoPuntoVentaPrecioId(): number | null {
    return this.insumoPuntoVentaPrecioControl.value;
  }

  get monedaControl(): FormControl {
    return this.form.get('moneda_id') as FormControl;
  }

  get monedaId(): number | null {
    return this.monedaControl.value;
  }

  get monto(): number {
    return roundString(this.montoRetiradoControl.value);
  }

  get cantidadRetirada(): number {
    return roundString(this.cantidadControl.value);
  }

  get montoRetiradoControl(): FormControl {
    return this.form.get('monto_retirado') as FormControl;
  }

  get limiteAnticipoCamion(): number | null {
    return this.oc?.camion_limite_monto_anticipos ?? null;
  }

  get anticipoDisponibleCamion(): number {
    return this.oc?.camion_monto_anticipo_disponible ?? 0;
  }

  get anticipoRetiradoCamion(): number {
    return this.oc?.camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso ?? 0;
  }

  get montoRetiradoEnMonedaLocal(): number {
    if (this.monedaOrigenId === this.monedaDestinoId) {
      return this.monto;
    }
    if (this.cotizacionOrigen && this.cotizacionDestino) {
      const convertido = (this.monto * this.cotizacionOrigen) / this.cotizacionDestino;
      return convertido;
    }

    return this.monto;
  }

  get montoRetiradoHint(): string {
    const formatNumber = (value: number): string => {
      return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value);
    };
    if (!this.tipoInsumoId) {
      const saldoTractoTexto =
        this.limiteAnticipoCamion === null
          ? 'Sin límites'
          : formatNumber(this.anticipoDisponibleCamionConvertido ?? 0);

      return `
        <div style="font-size: 16px; margin-bottom: 4px;">
          <span class="hint-alert-label" style="font-weight: bold;">Saldo OC:</span>
          <strong>0</strong>
          <span>|</span>
          <span class="hint-alert-label" style="font-weight: bold;">Saldo Tracto:</span>
          <strong>${saldoTractoTexto}</strong>
        </div>
      `;
    }
    const montoConvertido = this.montoRetiradoEnMonedaLocal; //solo se usa en caso de moneda local, no aplica por ahora
    const monto = this.monto || 0;

    if (this.saldoDisponible < 0) {
      const excedente = formatNumber(subtract(monto, this.saldoDisponible));
      return `<span>El saldo es negativo: <strong>${formatNumber(this.saldoDisponible)}</strong>.
      El monto supera en <strong>${excedente}</strong> al saldo.</span>`;
    }

    if (this.limiteAnticipoCamion !== null && this.limiteAnticipoCamion > 0) {
      if (monto > this.saldoDisponible) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
          subtract(monto, this.saldoDisponible)
        )}</strong> al saldo disponible</span>`;
      }

      if (monto > this.anticipoDisponibleCamion) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
          subtract(monto, this.anticipoDisponibleCamion)
        )}</strong> al anticipo del tracto disponible</span>`;
      }
    }

    if (this.limiteAnticipoCamion === 0 && monto > this.saldoDisponible) {
      return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
        subtract(monto, this.saldoDisponible)
      )}</strong> al saldo disponible</span>`;
    }

    const saldoMostrar =
      this.limiteAnticipoCamion !== null && this.limiteAnticipoCamion > 0
        ? Math.min(this.saldoDisponible, this.anticipoDisponibleCamion)
        : this.saldoDisponible;

    if (this.monto && saldoMostrar === 0) {
      return `<span class="hint-alert">El saldo disponible es 0.</span>`;
    }

    // const saldoOC = this.convertToMoneda(
    //   (this.oc?.porcentaje_anticipos ?? [])
    //     .filter((a: any) => {
    //       return a.concepto?.toLowerCase() === this.tipoInsumo?.toLowerCase();
    //     })
    //     .map((a: any) => ({
    //       ...a,
    //       saldo_oc: this.getSaldoAnticipo(a),
    //     }))
    //     .reduce((total: number, a: any) => total + (a.saldo_oc ?? 0), 0)
    // );

    const saldoTractoTexto =
      this.limiteAnticipoCamion === null
        ? 'Sin límites'
        : formatNumber(this.anticipoDisponibleCamionConvertido - monto);

    return `
      <div style="font-size: 16px; margin-bottom: 4px;">
      <!--  <span class="hint-alert-label" style="font-weight: bold;">Saldo OC:</span>
        <strong>${formatNumber(monto)}</strong>
        <span>|</span> -->
         <span class="hint-alert-label" style="font-weight: bold;">Saldo OC:</span>
        <strong>${formatNumber(saldoMostrar)}</strong>
        <span>|</span>
        <span class="hint-alert-label" style="font-weight: bold;">Saldo Tracto:</span>
        <strong>${saldoTractoTexto}</strong>
      </div>
      <!--
      <div style="font-size: 16px; margin-bottom: 4px;">
        <span class="hint-alert-label" style="font-weight: bold;">Saldo:</span>
        <strong>${formatNumber(saldoMostrar - monto)}</strong>
      </div>
      -->
      <div style="font-size: 16px;">
        <span class="hint-alert-label" style="font-weight: bold;">Monto:</span>
        <strong>${formatNumber(monto)}</strong>
        <!--
        <span class="hint-alert-label" style="font-weight: bold;">Línea Disponible:</span>
        <strong>${formatNumber(saldoMostrar)}</strong>
        -->
      </div>
    `;
  }

  @Output() valueChange = new EventEmitter<string>();
  tiposAnticipo = [
    { value: 'efectivo', descripcion: 'EFECTIVO' },
    { value: 'insumo', descripcion: 'INSUMO' }
  ];

get saldoDisponible(): number {
  console.log('➡️ saldoAnticipo:', this.saldoAnticipo);
  console.log('➡️ cotizacionOrigen:', this.cotizacionOrigen);
  console.log('➡️ cotizacionDestino:', this.cotizacionDestino);

  if (this.cotizacionOrigen && this.cotizacionDestino) {
    const calculado = (this.saldoAnticipo * this.cotizacionDestino) / this.cotizacionOrigen;
    console.log('🧮 saldoDisponible calculado con cotizaciones:', calculado);
    return calculado;
  }

  console.log('🧮 saldoDisponible sin cotización:', this.saldoAnticipo);
  return this.saldoAnticipo;
}


  // getSaldoAnticipo(anticipo: any): number {
  //   if (!this.fleteAnticipo?.id) {
  //     return 0;
  //   }
  //   const saldo_combustible = this.oc?.flete_saldo_combustible ?? 0;
  //   const saldo_lubricante = this.oc?.flete_saldo_lubricante ?? 0;
  //   const montoRetiradoCombustible = this.oc?.resultado_propietario_total_anticipos_retirados_combustible ?? 0;
  //   const montoRetiradoLubricantes = this.oc?.resultado_propietario_total_anticipos_retirados_lubricantes ?? 0;
  //   const limiteAnticipoCamion = this.oc?.camion_limite_monto_anticipos ?? 0;
  //   const flete_monto_combustible = this.oc?.flete_monto_combustible ?? 0;
  //   const flete_monto_lubricante = this.oc?.flete_monto_lubricante ?? 0;

  //   const concepto = anticipo.concepto.toUpperCase();

  //   if (limiteAnticipoCamion === 0) {
  //     if (concepto === 'COMBUSTIBLE') {
  //       return flete_monto_combustible - montoRetiradoCombustible;
  //     } else if (concepto === 'LUBRICANTES') {
  //       return flete_monto_lubricante - montoRetiradoLubricantes;
  //     } else {
  //       return 0;
  //     }
  //   }

  //   if (concepto === 'COMBUSTIBLE') {
  //     return saldo_combustible - montoRetiradoCombustible;
  //   } else if (concepto === 'LUBRICANTES') {
  //     return saldo_lubricante - montoRetiradoLubricantes;
  //   } else {
  //     return 0;
  //   }
  // }

  get anticipoDisponibleCamionConvertido(): number {
    if (this.monedaOrigenId === this.monedaDestinoId) {
      return this.anticipoDisponibleCamion;
    }

    if (this.cotizacionOrigen) {
      const convertido = this.anticipoDisponibleCamion / this.cotizacionOrigen;
      return Math.floor(convertido * 100) / 100;
    }
    return this.anticipoDisponibleCamion;
  }

  convertToMoneda(monto: number): number {
    if (this.monedaOrigenId === this.monedaDestinoId) {
      return monto;
    }

    if (this.cotizacionOrigen) {
      const convertido = monto / this.cotizacionOrigen;
      return Math.floor(convertido * 100) / 100;
    }

    return monto;
  }

  get montoRetirado(): number {
    return this.montoRetiradoCombustible ?? 0;
  }

  get ordenCargaId(): number {
    return this.dialogData.orden_carga_id;
  }

  get precioUnitarioControl(): FormControl {
    return this.form.get('precio_unitario') as FormControl;
  }

  get proveedorControl(): FormControl {
    return this.form.get('proveedor_id') as FormControl;
  }

  get proveedorId(): number | null {
    return this.proveedorControl.value;
  }

  get puntoVentaControl(): FormControl {
    return this.form.get('punto_venta_id') as FormControl;
  }

  get puntoVentaId(): number | null {
    return this.puntoVentaControl.value;
  }

  get tipoAnticipoControl(): FormControl {
    return this.form.get('tipo_anticipo_id') as FormControl;
  }

  get tipoAnticipoId(): number | null {
    return this.tipoAnticipoControl.value;
  }

  get tipoInsumoControl(): FormControl {
    return this.form.get('tipo_insumo_id') as FormControl;
  }

  get tipoInsumoId(): number | null {
    return this.tipoInsumoControl.value;
  }

  get isSubmitDisabled(): boolean {
    // Si el saldoDisponible es negativo, deshabilitar
    if (this.saldoDisponible < 0) {
        return true;
    }
    // Si el monto es mayor que el saldoDisponible
    if (this.monto > this.saldoDisponible) {
        return true;
    }
    // // Si la cantidadRetirada es mayor que el saldoDisponible
    // if (this.cantidadRetirada > this.saldoDisponible) {
    //     return true;
    // }
    // Si limiteAnticipoCamion > 0, deshabilitar si monto es mayor que anticipoDisponibleCamion
    if (this.limiteAnticipoCamion !== null && this.limiteAnticipoCamion > 0 && this.monto > this.anticipoDisponibleCamion) {
      return true;
    }
    // Si limiteAnticipoCamion === 0, deshabilitar si monto es mayor que saldoDisponible
    if (this.limiteAnticipoCamion === 0 && this.monto > this.saldoDisponible) {
        return true;
    }
    // Si todas las condiciones son correctas, habilitar el submit
    return false;
  }

  constructor(
    private fleteAnticipoService: FleteAnticipoService,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private ordenCargaAnticipoSaldoService: OrdenCargaAnticipoSaldoService,
    public dialogRef: MatDialogRef<OcAnticipoRetiradoInsumoDialogComponent>,
    private fb: FormBuilder,
    private monedaService: MonedaService,
    private monedaCotizacionService: MonedaCotizacionService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData
  ) {}

  ngOnInit(): void {
    this.loadOrdenCargaAnticipoSaldo(this.fleteAnticipoId);
      // Llamar a getLoggedUser() para obtener los datos del usuario logueado
      this.userService.getLoggedUser().subscribe((user) => {
        this.gestorCargaId = user.gestor_carga_id;

        this.monedaService.getMonedaByGestorId(this.gestorCargaId!).subscribe((moneda) => {
          this.monedaDestinoId = moneda?.id ?? null;

          this.monedaCotizacionService
            .getCotizacionByGestor(this.monedaDestinoId!, this.gestorCargaId!)
            .subscribe((responseDestino) => {
              this.cotizacionDestino = responseDestino?.cotizacion_moneda ?? null;

            });
        });
      });
  }

  get simboloMonedaGestora(): string {
    return this.simboloMoneda ?? 'PYG';
  }

  get oc(): OrdenCarga | null {
    return this.dialogData?.oc || null;
  }

  ngOnDestroy(): void {
    this.esConLitroSubscription.unsubscribe();
    this.fleteAnticipoEfectivoSubscription?.unsubscribe();
    this.fleteAnticipoInsumoSubscription?.unsubscribe();
    this.litroSubscription.unsubscribe();
  }

  submit() {
    if (this.montoRetiradoControl.value === 0) {
      alert("No se puede realizar el retiro con monto retirado igual a 0.");
      return;
    }

    if (this.cantidadControl.value === 0) {
      alert("No se puede realizar el retiro con cantidad retirada igual a 0.");
      return;
    }

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formValue = this.form.value;
      const monto_retirado = formValue.monto_retirado;
      const monedaDestino = this.monedaDestinoId;

      if (!this.cotizacionOrigen) {
        alert("No se pudo obtener la cotización de origen.");
        return;
      }

      this.monedaCotizacionService.getCotizacionByGestor(monedaDestino!, this.oc!.gestor_carga_id).subscribe({
        next: (responseDestino) => {
          const cotizacionDestino = responseDestino?.cotizacion_moneda;
          if (!cotizacionDestino) {
            alert("No se pudo obtener la cotización de destino.");
            return;
          }

          if (this.cotizacionOrigen == null) {
            alert("No se pudo obtener la cotización de origen.");
            return;
          }

          this.monto_mon_local = (monto_retirado * this.cotizacionOrigen) / cotizacionDestino;

          const data = {
            ...formValue,
            id: this.data?.id,
            orden_carga_id: this.ordenCargaId,
            monto_mon_local: this.monto_mon_local,
          };

          const formData = new FormData();
          formData.append('data', JSON.stringify(data));

          if (this.data?.id) {
            this.ordenCargaAnticipoRetiradoService.edit(this.data.id, formData).subscribe(this.close.bind(this));
          } else {
            this.ordenCargaAnticipoRetiradoService.create(formData).subscribe(this.close.bind(this));
          }

          this.montoRetiradoChange.emit(data.cantidad_retirada);
          this.montoRetiradoChange.emit(data.montoRetirado);
        },
        error: (err) => {
          console.error("Error al obtener cotización de destino:", err);
          alert("No se pudo obtener la cotización de destino.");
        }
      });
    }
  }

  tipoAnticipoChange(event: TipoAnticipo): void {
    this.saldoAnticipo = 0;
    this.tipoAnticipo = event;
    if (this.insumoControl) {
      this.insumoControl.setValidators(Validators.required);
      this.insumoControl.updateValueAndValidity();
    }

    if (this.insumoPuntoVentaPrecioControl) {
      this.insumoPuntoVentaPrecioControl.setValidators(Validators.required);
      this.insumoPuntoVentaPrecioControl.updateValueAndValidity();
    }

    if (this.tipoInsumoControl) {
      this.tipoInsumoControl.setValidators(Validators.required);
      this.tipoInsumoControl.updateValueAndValidity();
    }
  }

  insumoPuntoVentaPrecioChange(event?: InsumoPuntoVentaPrecioList): void {
    this.insumo = event?.insumo_descripcion;
    this.insumoControl.setValue(event?.insumo_id);
    this.moneda = event?.insumo_moneda_nombre;
    this.monedaSimbolo = event?.insumo_moneda_simbolo;
    this.monedaOrigenId = event?.insumo_moneda_id ?? null;
    this.monedaControl.setValue(event?.insumo_moneda_id);
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
    this.puntoVentaControl.setValue(event?.punto_venta_id);
    this.tipoInsumo = event?.insumo_tipo_descripcion;
    this.tipoInsumoControl.setValue(event?.insumo_tipo_id);
    this.precioUnitarioControl.setValue(event?.precio);
    this.getSaldoDisponibledForInsumo(event);

    if (this.monedaOrigenId !== null) {
      this.monedaCotizacionService.getCotizacionByGestor(this.monedaOrigenId, this.oc?.gestor_carga_id ?? 0).subscribe({
        next: (responseDestino) => {
          this.cotizacionOrigen = responseDestino?.cotizacion_moneda ?? null;
        },
        error: (err) => {
          console.error("Error al obtener cotización de destino:", err);
          alert("No se pudo obtener la cotización de destino.");
        }
      });
    } else {
      console.error('La moneda de destino no está definida.');
      alert('Por favor, seleccione una moneda de destino válida.');
    }
  }

  puntoVentaChange(event?: PuntoVentaList): void {
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
    this.getSaldoDisponibledForInsumo(event);
  }

  private close(data: OrdenCargaAnticipoRetirado): void {
    this.dialogRef.close(data);this.saldoAnticipo
  }


  private getSaldoDisponibledForInsumo(
    event?: InsumoPuntoVentaPrecioList | PuntoVentaList
  ): void {
    if (
      event &&
      this.isTipoInsumo &&
      this.tipoAnticipoId &&
      this.tipoInsumoId
    ) {
      this.fleteAnticipoInsumoSubscription?.unsubscribe();
      this.fleteAnticipoInsumoSubscription = this.fleteAnticipoService
        .getByTipoIdAndFleteIdAndTipoInsumoId(
          this.tipoAnticipoId,
          this.fleteId,
          this.tipoInsumoId
        )
        .subscribe((fleteAnticipo) => {
          this.setFleteAnticipo(fleteAnticipo);
        });
    }
  }

  private loadOrdenCargaAnticipoSaldo(
    fleteAnticipoId: number | null | undefined
  ): void {
    if (fleteAnticipoId) {
      this.ordenCargaAnticipoSaldoService
        .getByFleteAnticipoIdAndOrdenCargaId(fleteAnticipoId, this.ordenCargaId)
        .subscribe(this.setOrdenCargaAnticipoSaldo.bind(this));
    }
  }

  private setFleteAnticipo(fleteAnticipo: FleteAnticipo): void {
    this.fleteAnticipo = fleteAnticipo;
    this.fleteAnticipoControl.setValue(fleteAnticipo.id);
    this.loadOrdenCargaAnticipoSaldo(fleteAnticipo.id);
  }

  private setOrdenCargaAnticipoSaldo(saldo: number): void {
    this.saldoAnticipo = saldo;
    console.log('this.saldoAnticipo', this.saldoAnticipo)
    this.montoRetiradoControl.setValidators([
      Validators.required,
      Validators.min(0),
      NumberValidator.max(this.saldoDisponible),
    ]);
    this.montoRetiradoControl.updateValueAndValidity();
  }

  @Output() fleteAnticipoIdSelected: EventEmitter<number | null> = new EventEmitter<number | null>();

  onFleteAnticipoSelect(fleteAnticipoId: number | null): void {
    this.fleteAnticipoIdSelected.emit(fleteAnticipoId);
  }
}

