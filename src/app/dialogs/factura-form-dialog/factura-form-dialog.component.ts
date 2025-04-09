import { AfterViewInit, Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { facturaData } from 'src/app/form-data/factura';
import { FacturaForm } from 'src/app/interfaces/factura';
import { FacturaFormDialogData } from 'src/app/interfaces/factura-form-dialog-data';
import { Moneda } from 'src/app/interfaces/moneda';
import { FacturaService } from 'src/app/services/factura.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';

@Component({
  selector: 'app-factura-form-dialog',
  templateUrl: './factura-form-dialog.component.html',
  styleUrls: ['./factura-form-dialog.component.scss'],
})
export class FacturaFormDialogComponent implements AfterViewInit {
  foto: string | null = null;
  fotoFile: File | null = null;
  monedaLocal?: Moneda;
  moneda?: Moneda;

  form = this.fb.group({
    moneda_id: [this.data?.moneda_id, Validators.required],
    numero_factura: [this.data?.numero_factura, /*Validators.required, */ [Validators.maxLength(100)]],
    fecha_vencimiento: [
      this.data?.fecha_vencimiento ?? new Date().toJSON(),
      Validators.required,
    ],
    monto: [this.valorOperacion, [Validators.required, Validators.min(0)]],
    iva_id: [this.data?.iva_id, Validators.required],
    foto: [this.data?.foto, Validators.required],
    contribuyente: [this.data?.contribuyente ?? this.dialogData.contribuyente, [Validators.required, Validators.maxLength(50)]],
    iva: [this.data?.iva, [Validators.required, Validators.min(0)]],
    iva_incluido: [ this.data ? this.data.iva_incluido : false ],
    sentido_mov_iva: [ this.data?.sentido_mov_iva ],
    sentido_mov_iva_pagar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_iva_cobrar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'COBRAR' ? true : undefined : undefined],
    sentido_mov_retencion: [ this.data?.sentido_mov_retencion ],
    sentido_mov_retencion_pagar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_retencion_cobrar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'COBRAR' ? true : undefined : undefined ],
    retencion: [this.data?.retencion, /*[Validators.required, Validators.min(0)]*/],
    timbrado: [this.data?.timbrado, /*Validators.required, */ [Validators.maxLength(30)]],
    ruc: [this.data?.ruc ?? this.dialogData.ruc, [Validators.required, Validators.maxLength(25)]],
    fecha_factura: [this.data?.fecha_factura ?? new Date().toJSON(), Validators.required],
    iva_movimiento_id: [this.data?.iva_movimiento_id],
    retencion_movimiento_id: [this.data?.retencion_movimiento_id],
    tipo_cambio_moneda: [this.data?.tipo_cambio_moneda ?? 1, [Validators.required]],
  });

  get check_sentido_mov_iva_pagar():boolean {
    return true;
  }

  get check_sentido_mov_iva_cobrar():boolean {
    return true;
  }

  get actionText(): string {
    return this.data ? this.dialogData.isShow ? 'Ver' : 'Editar' : 'Crear';
  }

  get editFormCheck(): boolean {
    return this.dialogData?.item ? true : false;
  }

  get data(): FacturaForm | undefined {
    return this.dialogData?.item;
  }

  get isEdit(): boolean {
    return !!this.data;
  }

  get fotoControl(): FormControl {
    return this.form.get('foto') as FormControl;
  }

  get liquidacionId(): number {
    return this.dialogData.liquidacion_id;
  }

  get proveedorPDVId(): number | undefined {
    return this.dialogData.punto_venta_id;
  }

  get valorOperacion(): number {
    return this.dialogData.valor_operacion;
  }

  get tipo_contraparte_id(): number {
    return this.dialogData.tipo_contraparte_id;
  }

  get contraparte_id(): number {
    return this.dialogData.contraparte_id;
  }

  get isShow():boolean {
    return this.dialogData.isShow ?? false;
  }

  get showCotizacion():boolean {
    return this.monedaLocal?.id === this.moneda?.id;
  }

  constructor(
    private facturaService: FacturaService,
    private monedaService: MonedaService,
    private cotizacionService: MonedaCotizacionService,
    public dialogRef: MatDialogRef<FacturaFormDialogComponent>,
    private fb: FormBuilder,
    private ren: Renderer2,
    @Inject(MAT_DIALOG_DATA) private dialogData: FacturaFormDialogData
  ) {
    this.foto = this.data?.foto ?? null;
    /*if (!this.data) {
      this.fotoControl.setValidators(Validators.required);
    }*/
    if (this.dialogData.isShow) {
      this.form.disable();
    }
  }

  ngAfterViewInit(): void {
    this.monedaService.getMonedaByGestorId(1).subscribe( (resp:Moneda) => {
      this.monedaLocal = resp;
    });
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = facturaData(
        this.form,
        this.fotoFile,
        this.liquidacionId,
        this.tipo_contraparte_id,
        this.contraparte_id,
        this.proveedorPDVId,
      );

      if (this.data && this.data?.id) {
        this.facturaService.edit(this.data.id, formData).subscribe(this.close.bind(this));
      } else {
        this.facturaService.create(formData).subscribe(this.close.bind(this));
      }
    }
  }

  setFoto(file: File | null): void {
    this.foto = null;
    this.fotoFile = file;
  }

  onMonedaSelect(mon:Moneda){
    this.moneda = mon;
    
    if (mon.id !== this.monedaLocal!.id){
      this.cotizacionService.get_cotizacion_by_moneda(mon.id, this.monedaLocal!.id)
        .subscribe(res=>{
          if (res){
            this.form.controls['tipo_cambio_moneda'].enable();
            this.form.controls['tipo_cambio_moneda'].setValidators([Validators.required]);
            this.form.controls['tipo_cambio_moneda'].setValue(res.cotizacion_moneda); 
            this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
          }
      });
    } else {
      this.form.controls['tipo_cambio_moneda'].disable();
      this.form.controls['tipo_cambio_moneda'].setValidators([]);
      this.form.controls['tipo_cambio_moneda'].setValue(1); 
      this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
    }
  }

  /*checkState(el:any):any {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
        el.checked = false;
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-program-focused');
        this.currentCheckedValue = null;
      } else {
        this.currentCheckedValue = el.value
      }
    })
  }*/

  private close(data: FacturaForm): void {
    this.dialogRef.close(data);
  }
}
