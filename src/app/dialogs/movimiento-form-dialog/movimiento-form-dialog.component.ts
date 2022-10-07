import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { TipoContraparteEnum } from 'src/app/enums/tipo-contraparte-enum';
import { movimientoData } from 'src/app/form-data/movimiento';
import { ContraparteWithId } from 'src/app/interfaces/contraparte-info';
import { MovimientoForm } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { TipoContraparte } from 'src/app/interfaces/tipo-contraparte';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-movimiento-form-dialog',
  templateUrl: './movimiento-form-dialog.component.html',
  styleUrls: ['./movimiento-form-dialog.component.scss'],
})
export class MovimientoFormDialogComponent {
  openField = false;
  tipo?: TipoContraparte;
  form = this.fb.group({
    tipo_contraparte_id: [this.tipoContraparteId, Validators.required],
    contraparte: [this.contraparte, Validators.required],
    contraparte_numero_documento: this.contraparteNumeroDocumento,
    liquidacion_id: this.liquidacionId,
    tipo_documento_relacionado_id: this.data?.tipo_documento_relacionado_id,
    numero_documento_relacionado: this.data?.numero_documento_relacionado,
    cuenta_id: this.data?.cuenta_id,
    tipo_movimiento_id: this.data?.tipo_movimiento_id,
    estado: this.estado,
    fecha: this.fecha,
    monto: [this.data?.monto, Validators.required],
    moneda_id: [this.data?.moneda_id, Validators.required],
    detalle: this.data?.detalle,
    tipo_cambio_moneda: this.data?.tipo_cambio_moneda,
    fecha_cambio_moneda: this.data?.fecha_cambio_moneda,
    chofer_id: this.data?.chofer_id,
    propietario_id: this.data?.propietario_id,
    proveedor_id: this.data?.proveedor_id,
    remitente_id: this.data?.remitente_id,
  });

  get actionText(): string {
    return this.data ? 'Editar' : 'Crear';
  }

  get data(): MovimientoForm | undefined {
    return this.dialogData.item;
  }

  get estado(): MovimientoEstadoEnum {
    return this.dialogData.estado ?? MovimientoEstadoEnum.PENDIENTE;
  }

  get fecha(): string | undefined {
    return this.data?.fecha ?? new Date().toISOString();
  }

  get isContraparteEditable(): boolean {
    return this.dialogData.es_contraparte_editable;
  }

  get isOtro(): boolean {
    return this.tipo?.descripcion === TipoContraparteEnum.OTRO;
  }

  get isEdit(): boolean {
    return !!this.data;
  }

  get liquidacionId(): number | null {
    return this.data?.liquidacion_id ?? this.dialogData.liquidacion_id ?? null;
  }

  get contraparte(): string | null {
    return this.data?.contraparte ?? this.dialogData.contraparte ?? null;
  }

  get contraparteControl(): FormControl {
    return this.form.get('contraparte') as FormControl;
  }

  get contraparteNumeroDocumento(): string | null {
    return (
      this.data?.contraparte_numero_documento ??
      this.dialogData.contraparte_numero_documento ??
      null
    );
  }

  get contraparteNumeroDocumentoControl(): FormControl {
    return this.form.get('contraparte_numero_documento') as FormControl;
  }

  get cuentaControl(): FormControl {
    return this.form.get('cuenta_id') as FormControl;
  }

  get cuentaId(): number | undefined {
    return this.cuentaControl.value;
  }

  get tipoContraparteId(): number | null {
    return (
      this.data?.tipo_contraparte_id ??
      this.dialogData.tipo_contraparte_id ??
      null
    );
  }

  constructor(
    private movimientoService: MovimientoService,
    public dialogRef: MatDialogRef<MovimientoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: MovimientoFormDialogData
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = movimientoData(
        this.form,
        this.liquidacionId,
        this.openField
      );
      if (this.data && this.data?.id) {
        this.movimientoService
          .edit(this.data.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.movimientoService
          .create(formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  setContraparte(val: ContraparteWithId | undefined): void {
    if (val) {
      if (this.tipo?.descripcion == TipoContraparteEnum.PROPIETARIO) {
        this.form.controls['propietario_id'].setValue(val.id);
      } else if (this.tipo?.descripcion == TipoContraparteEnum.CHOFER) {
        this.form.controls['chofer_id'].setValue(val.id);
      } else if (this.tipo?.descripcion == TipoContraparteEnum.PROVEEDOR) {
        this.form.controls['proveedor_id'].setValue(val.id);
      } else if (this.tipo?.descripcion == TipoContraparteEnum.REMITENTE) {
        this.form.controls['remitente_id'].setValue(val.id);
      }
      this.contraparteNumeroDocumentoControl.setValue(
        val.contraparte_numero_documento
      );
    }
  }

  tipoContraparteChange(event: TipoContraparte): void {
    this.tipo = event;
    if (event.descripcion !== TipoContraparteEnum.OTRO) {
      this.openField = false;
    } else if (!this.openField && this.isContraparteEditable) {
      this.contraparteControl.setValue(null);
      this.contraparteNumeroDocumentoControl.setValue(null);
    }
  }

  private close(data: MovimientoForm): void {
    this.dialogRef.close(data);
  }
}
