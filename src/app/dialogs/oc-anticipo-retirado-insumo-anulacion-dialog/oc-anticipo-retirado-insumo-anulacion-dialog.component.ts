import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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
import { round, roundString, subtract } from 'src/app/utils/math';
import { NumberValidator } from 'src/app/validators/number-validator';
@Component({
  selector: 'app-oc-anticipo-retirado-insumo-anulacion-dialog',
  templateUrl: './oc-anticipo-retirado-insumo-anulacion-dialog.component.html',
  styleUrls: ['./oc-anticipo-retirado-insumo-anulacion-dialog.component.scss']
})
export class OcAnticipoRetiradoInsumoAnulacionDialogComponent  implements OnInit

{
  fleteAnticipo?: FleteAnticipo;
  insumo?: string;
  moneda?: string;
  proveedor?: string;
  tipoInsumo?: string;
  tipoAnticipo?: TipoAnticipo;
  saldoAnticipo = 0;
  
  
  form = this.fb.group({
    tipo_anticipo_id: ['insumo', Validators.required],
    tipo_insumo_id: this.data?.tipo_insumo_id,
    flete_anticipo_id: [this.data?.flete_anticipo_id, Validators.required],
    proveedor_id: [this.data?.proveedor_id, Validators.required],
    proveedor_nombre: [this.data?.proveedor_nombre, Validators.required],
    punto_venta_id: [this.data?.punto_venta_id, Validators.required],
    punto_venta_nombre: this.data?.punto_venta_nombre,
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

  @Input() isShow: boolean = false;

  ngOnInit(): void {
    this.form.get('monto_retirado')?.disable();
    this.form.get('cantidad_retirada')?.disable();
    this.tipoInsumo = this.data?.insumo_tipo_descripcion;
    this.insumo = this.data?.insumo_descripcion ?? '';
    this.moneda = this.data?.moneda_nombre
  }

  get actionText(): string {
    return this.data ? 'ANULAR' : 'NUEVO';
  }

  get data(): OrdenCargaAnticipoRetirado | undefined {
    return this.dialogData?.item;
  }

  get cantidadControl(): FormControl {
    return this.form.get('cantidad_retirada') as FormControl;
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
    let text = `<span class="hint-alert-label">Saldo</span> <strong>${this.saldoDisponible.toLocaleString()}</strong>`;
    return text;
  }
  @Output() valueChange = new EventEmitter<string>();
  tiposAnticipo = [
    { value: 'efectivo', descripcion: 'EFECTIVO' },
    { value: 'insumo', descripcion: 'INSUMO' }
  ];

  onSelectionChange(event: any): void {
    const selectedValue = event.value;
    this.valueChange.emit(selectedValue);
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
    public dialogRef: MatDialogRef<OcAnticipoRetiradoInsumoAnulacionDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData
  ) {}



  anularAnticipo() {
    if (this.data?.id) {
      this.ordenCargaAnticipoRetiradoService
        .anularAnticipoRetirado(this.data.id)
        .subscribe(this.close.bind(this));
    }
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
