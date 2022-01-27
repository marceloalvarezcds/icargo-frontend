import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { TipoAnticipoEnum } from 'src/app/enums/tipo-anticipo-enum';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';
import { InsumoPuntoVentaPrecio } from 'src/app/interfaces/insumo-punto-venta-precio';
import { OcAnticipoRetiradoDialogData } from 'src/app/interfaces/oc-anticipo-retirado-dialog-data';
import { OrdenCargaAnticipoRetirado } from 'src/app/interfaces/orden-carga-anticipo-retirado';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { FleteAnticipoService } from 'src/app/services/flete-anticipo.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { OrdenCargaAnticipoRetiradoService } from 'src/app/services/orden-carga-anticipo-retirado.service';
import { valueChange, valueMerge } from 'src/app/utils/form-control';

@Component({
  selector: 'app-oc-anticipo-retirado-form-dialog',
  templateUrl: './oc-anticipo-retirado-form-dialog.component.html',
  styleUrls: ['./oc-anticipo-retirado-form-dialog.component.scss']
})
export class OcAnticipoRetiradoFormDialogComponent implements OnDestroy {

  fleteAnticipo?: FleteAnticipo;
  insumoPuntoVentaPrecio?: InsumoPuntoVentaPrecio;
  tipoAnticipo?: TipoAnticipo;

  form = this.fb.group({
    tipo_anticipo_id: [this.data?.tipo_anticipo_id, Validators.required],
    tipo_insumo_id: this.data?.tipo_insumo_id,
    flete_anticipo_id: [this.data?.flete_anticipo_id, Validators.required],
    proveedor_id: [this.data?.proveedor_id, Validators.required],
    punto_venta_id: [this.data?.punto_venta_id, Validators.required],
    moneda_id: [this.data?.moneda_id, Validators.required],
    tipo_comprobante_id: [this.data?.tipo_comprobante_id, Validators.required],
    numero_comprobante: [this.data?.numero_comprobante, Validators.required],
    monto_retirado: [this.data?.monto_retirado, Validators.required],
    insumo_id: this.data?.insumo_id,
    insumo_punto_venta_precio_id: this.data?.insumo_punto_venta_precio_id,
    observacion: this.data?.observacion,
    unidad_id: this.data?.unidad_id,
    cantidad_retirada: this.data?.cantidad_retirada,
    precio_unitario: this.data?.precio_unitario,
  });

  tipoAnticipoSubscription = valueChange(this.tipoAnticipoControl).subscribe(() => {
    setTimeout(() => {
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
    }, 500);
  });

  fleteAnticipoSubscription = valueMerge(this.tipoAnticipoControl, this.tipoInsumoControl)
  .subscribe(() => {
    setTimeout(() => {
      if (this.isTipoInsumo) {
        if (this.tipoInsumoId) {
          this.fleteAnticipoService.getByTipoIdAndFleteIdAndTipoInsumoId(this.tipoAnticipoId!, this.fleteId, this.tipoInsumoId).subscribe(this.setFleteAnticipo.bind(this));
        }
      } else {
        this.fleteAnticipoService.getByTipoIdAndFleteId(this.tipoAnticipoId!, this.fleteId).subscribe(this.setFleteAnticipo.bind(this));
      }
    }, 500);
  });

  insumoPuntoVentaPrecioSubscription = valueMerge(this.insumoControl, this.monedaControl, this.puntoVentaControl)
  .pipe(filter(() => this.isTipoInsumo && !!this.insumoId && !!this.monedaId && !!this.puntoVentaId))
  .subscribe(() => {
    this.insumoPuntoVentaPrecioService.getByInsumoIdAndMonedaIdAndPuntoVentaId(this.insumoId!, this.monedaId!, this.puntoVentaId!).subscribe(this.setInsumoPuntoVentaPrecio.bind(this));
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear'
  }

  get data(): OrdenCargaAnticipoRetirado | undefined {
    return this.dialogData?.item;
  }

  get fleteAnticipoControl(): FormControl {
    return this.form.get('flete_anticipo_id') as FormControl;
  }

  get fleteId(): number {
    return this.dialogData.flete_id;
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

  constructor(
    private fleteAnticipoService: FleteAnticipoService,
    private insumoPuntoVentaPrecioService: InsumoPuntoVentaPrecioService,
    private ordenCargaAnticipoRetiradoService: OrdenCargaAnticipoRetiradoService,
    public dialogRef: MatDialogRef<OcAnticipoRetiradoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: OcAnticipoRetiradoDialogData,
  ) { }

  ngOnDestroy(): void {
    this.fleteAnticipoSubscription.unsubscribe();
    this.insumoPuntoVentaPrecioSubscription.unsubscribe();
    this.tipoAnticipoSubscription.unsubscribe();
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = JSON.parse(JSON.stringify({
        ...this.form.value,
        id: this.data?.id,
        orden_carga_id: this.dialogData.orden_carga_id,
      }));
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      if (this.data?.id) {
        this.ordenCargaAnticipoRetiradoService.edit(this.data?.id, formData).subscribe(this.close.bind(this));
      } else {
        this.ordenCargaAnticipoRetiradoService.create(formData).subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: OrdenCargaAnticipoRetirado): void {
    this.dialogRef.close(data);
  }

  private setFleteAnticipo(fleteAnticipo: FleteAnticipo): void {
    this.fleteAnticipo = fleteAnticipo;
    this.fleteAnticipoControl.setValue(fleteAnticipo.id);
  }

  private setInsumoPuntoVentaPrecio(precio: InsumoPuntoVentaPrecio | null): void {
    if (precio) {
      this.insumoPuntoVentaPrecio = precio;
      this.insumoPuntoVentaPrecioControl.setValue(precio.id);
    } else {
      this.insumoPuntoVentaPrecioControl.setValue(null);
      this.insumoPuntoVentaPrecioControl.markAsTouched();
      this.insumoPuntoVentaPrecioControl.markAsDirty();
    }
  }
}
