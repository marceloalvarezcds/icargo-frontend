import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TipoAnticipoEnum } from 'src/app/enums/tipo-anticipo-enum';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { FleteAnticipoService } from 'src/app/services/flete-anticipo.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { OrdenCargaAnticipoSaldoService } from 'src/app/services/orden-carga-anticipo-saldo.service';
import { valueMerge } from 'src/app/utils/form-control';
import { round, roundString, subtract } from 'src/app/utils/math';
import { NumberValidator } from 'src/app/validators/number-validator';

@Component({
  selector: 'app-oc-anticipo-retirado-form-dialog',
  templateUrl: './oc-anticipo-retirado-form-dialog.component.html',
  styleUrls: ['./oc-anticipo-retirado-form-dialog.component.scss'],
})
export class OcAnticipoRetiradoFormDialogComponent
  implements OnDestroy, OnInit
{
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

  litroSubscription = combineLatest([
    this.form.controls['cantidad_retirada'].valueChanges,
    this.precioUnitarioControl.valueChanges,
  ])
    .pipe(map(([c, p]) => [roundString(c), roundString(p)]))
    .subscribe(([cantidad, precio]) => {
      this.montoRetiradoControl.setValue(round(cantidad * precio));
    });

  fleteAnticipoSubscription = valueMerge(
    this.tipoAnticipoControl,
    this.tipoInsumoControl
  ).subscribe(() => {
    setTimeout(() => {
      if (this.isTipoInsumo) {
        if (this.tipoInsumoId) {
          this.fleteAnticipoService
            .getByTipoIdAndFleteIdAndTipoInsumoId(
              this.tipoAnticipoId!,
              this.fleteId,
              this.tipoInsumoId
            )
            .subscribe(this.setFleteAnticipo.bind(this));
        }
      } else {
        this.fleteAnticipoService
          .getByTipoIdAndFleteId(this.tipoAnticipoId!, this.fleteId)
          .subscribe(this.setFleteAnticipo.bind(this));
      }
    }, 500);
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
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

  get montoRetiradoHint(): string {
    if (this.monto > this.saldoDisponible) {
      return `<span class="hint-alert">El monto supera en <strong>${subtract(
        this.monto,
        this.saldoDisponible
      ).toLocaleString()}</strong> al Saldo</span>`;
    }
    let text = `Saldo <strong>${this.saldoDisponible.toLocaleString()}</strong>`;
    return text;
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

  get saldoDisponible(): number {
    return this.saldoAnticipo + this.montoRetirado;
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

  constructor(
    private fleteAnticipoService: FleteAnticipoService,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    private ordenCargaAnticipoSaldoService: OrdenCargaAnticipoSaldoService,
    public dialogRef: MatDialogRef<OcAnticipoRetiradoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData
  ) {}

  ngOnInit(): void {
    this.loadOrdenCargaAnticipoSaldo(this.fleteAnticipoId);
  }

  ngOnDestroy(): void {
    this.esConLitroSubscription.unsubscribe();
    this.fleteAnticipoSubscription.unsubscribe();
    this.litroSubscription.unsubscribe();
  }

  submit() {
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
    }
  }

  tipoAnticipoChange(event: TipoAnticipo): void {
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
  }

  puntoVentaChange(event?: PuntoVentaList): void {
    this.proveedor = event?.proveedor_nombre;
    this.proveedorControl.setValue(event?.proveedor_id);
  }

  private close(data: OrdenCargaAnticipoRetirado): void {
    this.dialogRef.close(data);
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
