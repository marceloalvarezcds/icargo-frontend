import { IvyParser } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { facturaData } from 'src/app/form-data/factura';
import { FacturaForm } from 'src/app/interfaces/factura';
import { FacturaFormDialogData } from 'src/app/interfaces/factura-form-dialog-data';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-factura-form-dialog',
  templateUrl: './factura-form-dialog.component.html',
  styleUrls: ['./factura-form-dialog.component.scss'],
})
export class FacturaFormDialogComponent {
  foto: string | null = null;
  fotoFile: File | null = null;

  form = this.fb.group({
    moneda_id: [this.data?.moneda_id, Validators.required],
    numero_factura: [this.data?.numero_factura, Validators.required],
    fecha_vencimiento: [
      this.data?.fecha_vencimiento ?? new Date().toJSON(),
      Validators.required,
    ],
    monto: [this.valorOperacion, [Validators.required, Validators.min(0)]],
    iva_id: [this.data?.iva_id, Validators.required],
    foto: this.data?.foto,
    contribuyente: [this.data?.contribuyente ?? this.dialogData.contribuyente, Validators.required],
    iva: [this.data?.iva, [Validators.required, Validators.min(0)]],
    iva_incluido: [ this.data?.iva_incluido ],
    sentido_mov_iva_pagar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_iva_cobrar: [ this.data?.sentido_mov_iva ? this.data?.sentido_mov_iva === 'COBRAR' ? true : undefined : undefined],
    sentido_mov_retencion_pagar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'PAGAR' ? true : undefined : undefined ],
    sentido_mov_retencion_cobrar: [ this.data?.sentido_mov_retencion ? this.data?.sentido_mov_retencion === 'COBRAR' ? true : undefined : undefined ],
    retencion: [this.data?.retencion, [Validators.required, Validators.min(0)]],
    timbrado: [this.data?.timbrado, Validators.required],
    ruc: [this.data?.ruc ?? this.dialogData.ruc, Validators.required],
    fecha_factura: [this.data?.fecha_factura ?? new Date().toJSON(), Validators.required],
    iva_movimiento_id: [this.data?.iva_movimiento_id],
    retencion_movimiento_id: [this.data?.retencion_movimiento_id]
  });

  get check_sentido_mov_iva_pagar():boolean {
    return true;
  }

  get check_sentido_mov_iva_cobrar():boolean {
    return true;
  }

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
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

  get valorOperacion(): number {
    return this.dialogData.valor_operacion;
  }

  get tipo_contraparte_id(): number {
    return this.dialogData.tipo_contraparte_id;
  }

  get contraparte_id(): number {
    return this.dialogData.contraparte_id;
  }

  constructor(
    private facturaService: FacturaService,
    public dialogRef: MatDialogRef<FacturaFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: FacturaFormDialogData
  ) {
    this.foto = this.data?.foto ?? null;
    /*if (!this.data) {
      this.fotoControl.setValidators(Validators.required);
    }*/
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
      );
      if (this.data && this.data?.id) {
        this.facturaService
          .edit(this.data.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.facturaService.create(formData).subscribe(this.close.bind(this));
      }
    }
  }

  setFoto(file: File | null): void {
    this.foto = null;
    this.fotoFile = file;
  }

  private close(data: FacturaForm): void {
    this.dialogRef.close(data);
  }
}
