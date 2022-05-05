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
    fecha_vencimiento: [this.data?.fecha_vencimiento, Validators.required],
    monto: [this.data?.monto, [Validators.required, Validators.min(0)]],
    iva_id: [this.data?.iva_id, Validators.required],
    foto: this.data?.foto,
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
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

  constructor(
    private facturaService: FacturaService,
    public dialogRef: MatDialogRef<FacturaFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: FacturaFormDialogData
  ) {
    this.foto = this.data?.foto ?? null;
    if (!this.data) {
      this.fotoControl.setValidators(Validators.required);
    }
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = facturaData(
        this.form,
        this.fotoFile,
        this.liquidacionId
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
