import { AfterViewInit, Component, Inject, Input, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { pairwise } from 'rxjs/operators';
import { facturaData } from 'src/app/form-data/factura';
import { FacturaForm } from 'src/app/interfaces/factura';
import { FacturaFormDialogData } from 'src/app/interfaces/factura-form-dialog-data';
import { Moneda } from 'src/app/interfaces/moneda';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { TipoIva } from 'src/app/interfaces/tipo-iva';
import { PdfPreviewConciliarDialogComponent } from 'src/app/orden-carga/pdf-preview-conciliar-dialog/pdf-preview-conciliar-dialog.component';
import { FacturaService } from 'src/app/services/factura.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { ReportsService } from 'src/app/services/reports.service';

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

  @Input() item: Movimiento | null | undefined

  form = this.fb.group({
    id: [this.data?.id],
    moneda_id: [this.data?.moneda_id, Validators.required],
    numero_factura: [this.data?.numero_factura, /*Validators.required, */ [Validators.maxLength(100)]],
    fecha_vencimiento: [
      this.data?.fecha_vencimiento ?? new Date().toJSON(),
      Validators.required,
    ],
    monto: [this.valorOperacion, [Validators.required, Validators.min(0)]],
    iva_id: [this.data ? this.data.iva_id : 1, Validators.required],
    foto: [this.data?.foto, null],
    contribuyente: [this.data?.contribuyente ?? this.dialogData.contribuyente, [Validators.required, Validators.maxLength(50)]],
    iva: [this.data?.iva, [Validators.required, Validators.min(0)]],
    iva_incluido: [this.data ? this.data.iva_incluido : 'SI', Validators.required],
    sentido_mov_iva: [ this.data?.sentido_mov_iva ?? 'PAGAR' ],
    sentido_mov_iva_pagar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_iva_cobrar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'COBRAR' ? true : undefined : undefined],
    sentido_mov_retencion: [ this.data?.sentido_mov_retencion  ?? 'COBRAR' ],
    sentido_mov_retencion_pagar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_retencion_cobrar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'COBRAR' ? true : undefined : undefined ],
    tipo_retencion: [this.data?.tipo_retencion ?? 'NO'],
    retencion: [this.data?.retencion, /*[Validators.required, Validators.min(0)]*/],
    timbrado: [this.data?.timbrado, /*Validators.required, */ [Validators.maxLength(30)]],
    ruc: [this.data?.ruc ?? this.dialogData.ruc, [Validators.required, Validators.maxLength(25)]],
    fecha_factura: [this.data?.fecha_factura ?? new Date().toJSON(), Validators.required],
    iva_movimiento_id: [this.data?.iva_movimiento_id],
    retencion_movimiento_id: [this.data?.retencion_movimiento_id],
    tipo_cambio_moneda: [this.data ? (this.data.tipo_cambio_moneda ?? 1) : 1, [Validators.required]],
  });

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

  get montoControl(): FormControl {
    return this.form.get('monto') as FormControl;
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
    private reportsService: ReportsService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private dialogData: FacturaFormDialogData
  ) {
    this.foto = this.data?.foto ?? null;
    /*if (!this.data) {
      this.fotoControl.setValidators(Validators.required);
    }*/

    if (this.dialogData.isShow) {
      this.form.disable();
    }

    if (this.editFormCheck) {
      this.form.controls['sentido_mov_iva']?.disable();
      this.form.controls['sentido_mov_retencion']?.disable();
    }
  }

  ngAfterViewInit(): void {
    // TODO: obtener info gestor carga
    this.monedaService.getMonedaByGestorId(1).subscribe( (resp:Moneda) => {
      this.monedaLocal = resp;
    });
  }

  get hasEfectivo(): boolean {
    return (this.dialogData?.saldo_anticipos_efectivo ?? 0) > 0;
  }

  get hasCombustible(): boolean {
    return (this.dialogData?.saldo_anticipos_combustible ?? 0) > 0;
  }

  get hasFlete(): boolean {
    return (this.dialogData?.saldo_anticipos_flete ?? 0) > 0;
  }

  get hasMerma(): boolean {
    return (this.dialogData?.saldo_anticipos_merma ?? 0) > 0;
  }

  get hasOtro(): boolean {
    return (this.dialogData?.saldo_anticipos_otro ?? 0) > 0;
  }

  get hasComplementoDescuento(): boolean {
    return (this.dialogData?.saldo_anticipos_complemento_descuento ?? 0) > 0;
  }

  get topMargin(): number {
    let count = 0;
    if (this.hasEfectivo) count++;
    if (this.hasCombustible) count++;
    if (this.hasFlete) count++;
    if (this.hasMerma) count++;
    if (this.hasOtro) count++;
    if (this.hasComplementoDescuento) count++;

    return count > 0 ? count * 11 : 11;
  }


get montoRetiradoHint(): string {
  const {
    saldo_anticipos_efectivo = 0,
    saldo_anticipos_combustible = 0,
    saldo_anticipos_flete = 0,
    saldo_anticipos_merma = 0,
    saldo_anticipos_otro = 0,
    saldo_anticipos_complemento_descuento = 0
  } = this.dialogData;

  const parts: string[] = [];

  if (saldo_anticipos_efectivo)
    parts.push(`Anticipo efectivo: <strong>${saldo_anticipos_efectivo.toLocaleString('es-PY')}</strong>`);
  if (saldo_anticipos_combustible)
    parts.push(`Anticipo combustible: <strong>${saldo_anticipos_combustible.toLocaleString('es-PY')}</strong>`);
  if (saldo_anticipos_complemento_descuento)
    parts.push(`Complemento / Descuento: <strong>${saldo_anticipos_complemento_descuento.toLocaleString('es-PY')}</strong>`);
  if (saldo_anticipos_flete)
    parts.push(`Flete: <strong>${saldo_anticipos_flete.toLocaleString('es-PY')}</strong>`);
  if (saldo_anticipos_merma)
    parts.push(`Merma: <strong>${saldo_anticipos_merma.toLocaleString('es-PY')}</strong>`);
  if (saldo_anticipos_otro)
    parts.push(`Otro: <strong>${saldo_anticipos_otro.toLocaleString('es-PY')}</strong>`);

  if (parts.length === 0) return '';

  return `<span>${parts.join(' &nbsp;|&nbsp; ')}</span>`;
}


  calcularIva(): void {
    const monto = this.form.get('monto')?.value ?? 0;
    const ivaIncluido = this.form.get('iva_incluido')?.value;
    const ivaId = this.form.get('iva_id')?.value;

    let factorDiv = 1.1;
    let factorMult = 0.1;

    if (ivaId === 2) {
      factorDiv = 1.21;
      factorMult = 0.21;
    }

    let ivaCalculado = 0;

    if (ivaIncluido === 'SI') {
      ivaCalculado = monto - (monto / factorDiv);
    } else if (ivaIncluido === 'NO') {
      ivaCalculado = monto * factorMult;
    } else if (ivaIncluido === 'EXCENTO') {
      ivaCalculado = 0;

      // Deshabilitar campos relacionados cuando es EXCENTO
      this.form.get('iva_id')?.disable({ emitEvent: false });
      this.form.get('iva')?.disable({ emitEvent: false });
      this.form.get('sentido_mov_iva')?.disable({ emitEvent: false });
      this.form.get('tipo_retencion')?.disable({ emitEvent: false });
      this.form.get('retencion')?.disable({ emitEvent: false });
      this.form.get('sentido_mov_retencion')?.disable({ emitEvent: false });

      this.form.get('iva')?.setValue(0, { emitEvent: false });
      this.form.get('retencion')?.setValue(0, { emitEvent: false });
      return; // cortar aquí para no reactivar campos
    }

    // Rehabilitar si no es EXCENTO
    this.form.get('iva_id')?.enable({ emitEvent: false });
    this.form.get('iva')?.enable({ emitEvent: false });
    this.form.get('sentido_mov_iva')?.enable({ emitEvent: false });
    this.form.get('tipo_retencion')?.enable({ emitEvent: false });
    this.form.get('retencion')?.enable({ emitEvent: false });
    this.form.get('sentido_mov_retencion')?.enable({ emitEvent: false });

    this.form.get('iva')?.setValue(Math.round(ivaCalculado), { emitEvent: false });
  }

  calcularRetencion(): void {
    const iva = this.form.get('iva')?.value ?? 0;
    const tipoRetencion = this.form.get('tipo_retencion')?.value;

    let factor = 0;

    if (tipoRetencion === '5') {
      factor = 0.05;
    } else if (tipoRetencion === '30') {
      factor = 0.3;
    }

    const retencionCalculada = iva * factor;
    this.form.get('retencion')?.setValue(Math.round(retencionCalculada), { emitEvent: false });
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

    this.montoControl.setValidators([]);
    this.montoControl.updateValueAndValidity();

    if (this.moneda?.simbolo !== 'PYG') {
      // habilitar decimales
      this.montoControl.setValidators(
        [
          Validators.required,
          Validators.pattern('^([0-9]{1,12}(\.[0-9]{1,2})?)$'),
        ]
      );
    } else {
      // inhabilitar decimales
      this.montoControl.setValidators(
        [
          Validators.required,
          Validators.pattern('^([0-9]{1,12}?)$'),
        ]
      );
    }

    this.montoControl.updateValueAndValidity();

    if (mon.id !== this.monedaLocal?.id){
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

  onTipoIvaSelect(tipoIva:TipoIva){
    if (tipoIva.iva === 0) {
      this.form.controls['iva'].setValue(0);
      this.form.controls['iva'].disable();
      this.form.controls['iva'].updateValueAndValidity()
      this.form.controls['retencion'].setValue(0);
      this.form.controls['retencion'].disable();
      this.form.controls['retencion'].updateValueAndValidity()
    } else {
      this.form.controls['iva'].enable();
      this.form.controls['iva'].setValidators([Validators.required, Validators.min(0)]);
      this.form.controls['iva'].updateValueAndValidity()
      this.form.controls['retencion'].enable();
      this.form.controls['retencion'].updateValueAndValidity();
      this.calcularIva();
      this.calcularRetencion();
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
