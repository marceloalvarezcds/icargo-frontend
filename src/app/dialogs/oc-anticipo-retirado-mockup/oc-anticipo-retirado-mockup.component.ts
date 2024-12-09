
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
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
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { OrdenCargaAnticipoSaldoService } from 'src/app/services/orden-carga-anticipo-saldo.service';
import { round, roundString, subtract } from 'src/app/utils/math';
import { NumberValidator } from 'src/app/validators/number-validator';
@Component({
  selector: 'app-oc-anticipo-retirado-mockup',
  templateUrl: './oc-anticipo-retirado-mockup.component.html',
  styleUrls: ['./oc-anticipo-retirado-mockup.component.scss']
})
export class OcAnticipoRetiradoMockupComponent  implements OnDestroy, OnInit
{
  @Output() montoRetiradoChange = new EventEmitter<number>();

  fleteAnticipo?: FleteAnticipo;
  insumo?: string;
  moneda?: string;
  proveedor?: string;
  tipoInsumo?: string;
  tipoAnticipo?: TipoAnticipo;
  saldoAnticipo = 0;


  form = this.fb.group({
    tipo_anticipo_id: [this.data?.tipo_anticipo_id, Validators.required],
    tipo_insumo_id: this.data?.tipo_insumo_id,
    flete_anticipo_id: [this.data?.flete_anticipo_id, Validators.required],
    proveedor_id: [this.data?.proveedor_id, Validators.required],
    punto_venta_id: [this.data?.punto_venta_id, Validators.required],
    moneda_id: [this.data?.moneda_id, Validators.required],
    tipo_comprobante_id: this.data?.tipo_comprobante_id,
    numero_comprobante: this.data?.numero_comprobante,
    monto_retirado: [
      this.data?.monto_retirado,
      [Validators.required, Validators.min(0)],
    ],
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
    return this.data ? 'Editar' : 'NUEVO';
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

  get anticipoRetitadoCamion(): number {
    return this.oc?.camion_monto_anticipo_disponible ?? 0;
  }

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

    if (this.monto > this.saldoDisponible) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
            subtract(this.monto, this.saldoDisponible)
        )}</strong> al saldo disponible</span>`;
    }

    if (this.monto > this.anticipoRetitadoCamion) {
        return `<span class="hint-alert">El monto supera en <strong>${formatNumber(
            subtract(this.monto, this.anticipoRetitadoCamion)
        )}</strong> al anticipo del tracto disponible</span>`;
    }

    const saldoMostrar = Math.min(this.saldoDisponible, this.anticipoRetitadoCamion);

    return `<span class="hint-alert-label">Saldo</span> <strong>${formatNumber(saldoMostrar)}</strong>`;
  }

  
  @Output() valueChange = new EventEmitter<string>();
  tiposAnticipo = [
    { value: 'efectivo', descripcion: 'EFECTIVO' },
    { value: 'insumo', descripcion: 'INSUMO' }
  ];

  get saldoDisponible(): number {
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
    if (this.saldoDisponible < 0) {
        return true;
    }
    if (this.monto > this.saldoDisponible) {
        return true;
    }

    if (this.monto > this.anticipoRetitadoCamion) {
        return true;
    }

    return false; 
  }


  constructor(
    private fleteAnticipoService: FleteAnticipoService,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private ordenCargaAnticipoSaldoService: OrdenCargaAnticipoSaldoService,
    public dialogRef: MatDialogRef<OcAnticipoRetiradoMockupComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData
  ) {}

  ngOnInit(): void {
    this.loadOrdenCargaAnticipoSaldo(this.fleteAnticipoId);
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
      const data = JSON.parse(
        JSON.stringify({
          ...this.form.value,
          id: this.data?.id,
          orden_carga_id: this.ordenCargaId,
        })
      );
      
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.data?.id) {
        this.ordenCargaAnticipoRetiradoService
          .edit(this.data?.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.ordenCargaAnticipoRetiradoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
      this.montoRetiradoChange.emit(data.cantidad_retirada); 
      this.montoRetiradoChange.emit(data.montoRetirado);
    }
  }

  tipoAnticipoChange(event: TipoAnticipo): void {
    this.saldoAnticipo = 0;
    this.tipoAnticipo = event;
    this.esConLitroControl.setValue(this.isTipoInsumo);
    if (this.isTipoInsumo) {
      this.insumoControl.setValidators(Validators.required);
      this.insumoPuntoVentaPrecioControl.setValidators(Validators.required);
      this.tipoInsumoControl.setValidators(Validators.required);
    } else {
      this.insumoControl.removeValidators(Validators.required);
      this.insumoPuntoVentaPrecioControl.removeValidators(Validators.required);
      this.tipoInsumoControl.removeValidators(Validators.required);
    }
    this.insumoControl.updateValueAndValidity();
    this.insumoPuntoVentaPrecioControl.updateValueAndValidity();
    this.tipoInsumoControl.updateValueAndValidity();
    this.insumoPuntoVentaPrecioChange();
    this.puntoVentaChange();
    this.getSaldoDisponibleForEfectivo();
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

  private getSaldoDisponibleForEfectivo(): void {
    if (!this.isTipoInsumo && this.tipoAnticipoId) {
      // Consulta saldo disponible para Efectivo
      this.fleteAnticipoEfectivoSubscription?.unsubscribe();
      this.fleteAnticipoEfectivoSubscription = this.fleteAnticipoService
        .getByTipoIdAndFleteId(this.tipoAnticipoId, this.fleteId)
        .subscribe((response) => {
          this.setFleteAnticipo(response);
        
        });
    }
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
        .subscribe(this.setFleteAnticipo.bind(this));
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
