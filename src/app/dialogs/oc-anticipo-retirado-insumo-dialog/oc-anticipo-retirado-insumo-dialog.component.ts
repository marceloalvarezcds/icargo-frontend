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
  insumoMonedaId: number | null = null;


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
          this.montoRetiradoControl.setValue(
            roundString(cantidad) * roundString(precio)
          );
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
      if (this.esConLitroControl.value === false && precio > 0) {
        const litrosCalculados = monto / precio;
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
          const montoCalculado = cantidad * precio;
          this.montoRetiradoControl.setValue(round(montoCalculado));
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

  get montoRetiradoControl(): FormControl {
    return this.form.get('monto_retirado') as FormControl;
  }

  get limiteAnticipoCamion(): number {
    return this.oc?.camion_limite_monto_anticipos ?? 0;
  }

  get anticipoDisponibleCamion(): number {
    return this.oc?.camion_monto_anticipo_disponible ?? 0;
  }

  get anticipoRetiradoCamion(): number {
    return this.oc?.camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso ?? 0;
  }
  saldoAnticipoConvertido: number = 0;

  get montoRetiradoHint(): string {
    const formatNumber = (value: number): string => {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    };

    if (this.saldoDisponible < 0) {
        const excedente = formatNumber(subtract(this.monto, this.saldoDisponible));
        return `<span>El saldo es negativo: <strong>${formatNumber(this.saldoDisponible)}</strong>.
        El monto supera en <strong>${excedente}</strong> al saldo.</span>`;
    }
    // Si limiteAnticipoCamion > 0, mostrar mensaje con anticipoDisponibleCamion
    if (this.limiteAnticipoCamion > 0 && this.monto > this.anticipoDisponibleCamion) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
            subtract(this.monto, this.anticipoDisponibleCamion)
        )}</strong> al anticipo del tracto disponible</span>`;
    }
    // Si limiteAnticipoCamion === 0, mostrar mensaje con saldoDisponible
    if (this.limiteAnticipoCamion === 0 && this.monto > this.saldoDisponible) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
            subtract(this.monto, this.saldoDisponible)
        )}</strong> al saldo disponible</span>`;
    }
    const saldoMostrar = this.limiteAnticipoCamion > 0
        ? Math.min(this.saldoDisponible, this.anticipoDisponibleCamion)
        : this.saldoDisponible;

    if (this.monto && saldoMostrar === 0) {
        return `<span class="hint-alert">El saldo disponible es 0.</span>`;
    }

    return `<span class="hint-alert-label" style="font-weight: bold; font-size: 16px;">Monto:</span>
    <strong style="font-size: 16px;">${formatNumber(this.monto)}</strong>
    | <span class="hint-alert-label" style="font-weight: bold; font-size: 16px;">Saldo:</span>
    <strong style="font-size: 16px;">${formatNumber(saldoMostrar)}</strong>`;

  }

  @Output() valueChange = new EventEmitter<string>();
  tiposAnticipo = [
    { value: 'efectivo', descripcion: 'EFECTIVO' },
    { value: 'insumo', descripcion: 'INSUMO' }
  ];

  get saldoDisponible(): number {
     if (this.cotizacionOrigen && this.cotizacionDestino) {
       return (this.saldoAnticipo * this.cotizacionOrigen) / this.cotizacionDestino + this.montoRetirado;
     }
    return this.saldoAnticipo + this.montoRetirado;
  }

  get montoRetirado(): number {
    return this.data?.monto_retirado ?? 0;
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
    // Si limiteAnticipoCamion > 0, deshabilitar si monto es mayor que anticipoDisponibleCamion
    if (this.limiteAnticipoCamion > 0 && this.monto > this.anticipoDisponibleCamion) {
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
    private insumoVentaPrecio: InsumoPuntoVentaPrecioService,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private ordenCargaAnticipoSaldoService: OrdenCargaAnticipoSaldoService,
    public dialogRef: MatDialogRef<OcAnticipoRetiradoInsumoDialogComponent>,
    private fb: FormBuilder,
    private monedaService: MonedaService,
    private monedaCotizacionService: MonedaCotizacionService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData
  ) {}

  ngOnInit(): void {
    this.loadOrdenCargaAnticipoSaldo(this.fleteAnticipoId);
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
      const monedaDestinoSubmitId = this.oc!.gestor_carga_moneda_id;

      this.monedaCotizacionService.getCotizacionByGestor(this.insumoMonedaId!, this.oc!.gestor_carga_id).subscribe({
        next: (responseOrigen) => {
          const cotizacionOrigen = responseOrigen?.cotizacion_moneda;
          if (!cotizacionOrigen) {
            alert("No se pudo obtener la cotización de origen.");
            return;
          }

          this.monedaCotizacionService.getCotizacionByGestor(monedaDestinoSubmitId, this.oc!.gestor_carga_id).subscribe({
            next: (responseDestino) => {
              const cotizacionDestino = responseDestino?.cotizacion_moneda;
              if (!cotizacionDestino) {
                alert("No se pudo obtener la cotización de destino.");
                return;
              }

              this.monto_mon_local = Math.round((monto_retirado * cotizacionOrigen) / cotizacionDestino);

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
            }
          });
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
    this.monedaControl.setValue(event?.insumo_moneda_id);
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
    this.puntoVentaControl.setValue(event?.punto_venta_id);
    this.tipoInsumo = event?.insumo_tipo_descripcion;
    this.tipoInsumoControl.setValue(event?.insumo_tipo_id);
    this.precioUnitarioControl.setValue(event?.precio);
    this.getSaldoDisponibledForInsumo(event);
  }

  puntoVentaChange(event?: PuntoVentaList): void {
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
    this.getSaldoDisponibledForInsumo(event);
  }

  private close(data: OrdenCargaAnticipoRetirado): void {
    this.dialogRef.close(data);
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
        .subscribe((response) => {
          this.setFleteAnticipo(response);
          const fleteAnticipoId = response.flete_id;
          if (fleteAnticipoId != null && !isNaN(fleteAnticipoId)) {
            this.getInsumoVentaPrecio(fleteAnticipoId, response.id ?? 0);
          } else {
            console.error('fleteAnticipoId no es un número válido o es null/undefined');
          }
        });
    }
  }

  private getInsumoVentaPrecio(fleteAnticipoId: number, id: number): void {
    if (fleteAnticipoId) {
      this.insumoVentaPrecio
        .getListByFleteId(fleteAnticipoId)
        .subscribe((response) => {
          const item = response.find((item) => item.id === id);
          if (item) {

            this.insumoMonedaId = item.insumo_moneda_id;
          } else {
            console.log('No se encontró el item con el id proporcionado.');
          }
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
    this.montoRetiradoControl.setValidators([
      Validators.required,
      Validators.min(0),
      NumberValidator.max(this.saldoDisponible),
    ]);
    this.montoRetiradoControl.updateValueAndValidity();
  }
}

