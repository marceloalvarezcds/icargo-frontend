import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { TipoContraparteEnum } from 'src/app/enums/tipo-contraparte-enum';
import { movimientoData } from 'src/app/form-data/movimiento';
import { ContraparteWithId } from 'src/app/interfaces/contraparte-info';
import { Moneda } from 'src/app/interfaces/moneda';
import { MovimientoForm } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { TipoContraparte } from 'src/app/interfaces/tipo-contraparte';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { MovimientoService } from 'src/app/services/movimiento.service';

@Component({
  selector: 'app-movimiento-form-dialog',
  templateUrl: './movimiento-form-dialog.component.html',
  styleUrls: ['./movimiento-form-dialog.component.scss'],
})
export class MovimientoFormDialogComponent implements AfterViewInit {
  openField = false;
  tipo?: TipoContraparte;
  form = this.fb.group({
    tipo_contraparte_id: [this.tipoContraparteId, Validators.required],
    contraparte_id: this.contraparteID,
    contraparte: [this.contraparte, Validators.required],
    contraparte_numero_documento: this.contraparteNumeroDocumento,
    liquidacion_id: this.liquidacionId,
    tipo_documento_relacionado_id: this.data?.tipo_documento_relacionado_id,
    numero_documento_relacionado: this.data?.numero_documento_relacionado,
    cuenta_id: [this.data?.cuenta_id,Validators.required],
    tipo_movimiento_id: this.data?.tipo_movimiento_id,
    es_cobro: this.data?.es_cobro ?? true,
    estado: this.estado,
    fecha: this.fecha,
    monto: [this.monto, [Validators.required, Validators.min(0)]],
    moneda: [this.data?.moneda_id, Validators.required],
    moneda_id: [],
    detalle: this.data?.detalle,
    tipo_cambio_moneda: this.data?.tipo_cambio_moneda ?? 1,
    fecha_cambio_moneda: this.data?.fecha_cambio_moneda,
    chofer_id: this.data?.chofer_id,
    propietario_id: this.data?.propietario_id,
    proveedor_id: this.data?.proveedor_id,
    remitente_id: this.data?.remitente_id,
    punto_venta_id: this.punto_venta_id,
    linea_movimiento: this.linea_movimiento
  });

  monedaLocal?: Moneda;
  moneda?: Moneda;

  get monto(): number | undefined {
    return this.data && this.data.monto < 0
      ? this.data?.monto * -1
      : this.data?.monto;
  }

  get contraparteID(): number | null | undefined {
    return this.data?.contraparte_id ? this.data?.contraparte_id : this.dialogData?.contraparte_id;
  }

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
    return this.dialogData?.tipo_contraparte_descripcion ? this.dialogData.tipo_contraparte_descripcion == TipoContraparteEnum.OTRO :
      this.tipo?.descripcion === TipoContraparteEnum.OTRO;
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
    if (this.dialogData.tipo_contraparte_descripcion == "PUNTO DE VENTA") {
      return (
        this.data?.contraparte_numero_documento ??
        this.dialogData.contraparte_numero_documento ??
        null
      )
      ;
    } else {
      return (
        this.data?.contraparte_numero_documento ??
        this.dialogData.contraparte_numero_documento ??
        null
      );
    }
  }

  get contraparteNumeroDocumentoControl(): FormControl {
    return this.form.get('contraparte_numero_documento') as FormControl;
  }

  get cuentaControl(): FormControl {
    return this.form.get('cuenta_id') as FormControl;
  }

  get tipoContraparteId(): number | null {
    return (
      this.data?.tipo_contraparte_id ??
      this.dialogData.tipo_contraparte_id ??
      null
    );
  }

  get punto_venta_id(): number | undefined {
    return (this.data?.punto_venta_id ??
        this.dialogData.punto_venta_id )
  }

  get linea_movimiento(): string | undefined {
    return (this.data?.linea_movimiento ??
      this.dialogData.linea_movimiento )
  }

  get showCotizacion():boolean {
    return this.monedaLocal?.id === this.moneda?.id;
  }

  constructor(
    private movimientoService: MovimientoService,
    private monedaService: MonedaService,
    private cotizacionService: MonedaCotizacionService,
    public dialogRef: MatDialogRef<MovimientoFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: MovimientoFormDialogData
  ) {  }

  ngAfterViewInit(): void {
    // TODO: obtener info gestor carga
    this.monedaService.getMonedaByGestorId(1).subscribe( (resp:Moneda) => {
      this.monedaLocal = resp;
    });

    if (!this.dialogData.es_contraparte_editable) {
      // seteamos los id contraparte segun tipo
      if (this.dialogData.tipo_contraparte_descripcion == TipoContraparteEnum.PROPIETARIO) {
        this.form.controls['propietario_id'].setValue(this.dialogData.contraparte_id);
      } else if (this.dialogData.tipo_contraparte_descripcion == TipoContraparteEnum.CHOFER) {
        this.form.controls['chofer_id'].setValue(this.dialogData.contraparte_id);
      } else if (this.dialogData.tipo_contraparte_descripcion == TipoContraparteEnum.PROVEEDOR) {
        this.form.controls['proveedor_id'].setValue(this.dialogData.contraparte_id);
      } else if (this.dialogData.tipo_contraparte_descripcion == TipoContraparteEnum.REMITENTE) {
        this.form.controls['remitente_id'].setValue(this.dialogData.contraparte_id);
      } else if (this.dialogData.tipo_contraparte_descripcion == "PUNTO DE VENTA") {
        this.form.controls['proveedor_id'].setValue(this.dialogData.contraparte_id);
        this.form.controls['punto_venta_id'].setValue(this.dialogData.punto_venta_id);

      }

      if (this.dialogData.punto_venta_id) {
        this.form.controls['punto_venta_id'].setValue(this.dialogData.punto_venta_id);
      }

    }

  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const descripcionControl = this.form.get('detalle');
      if (descripcionControl && descripcionControl.value) {
        descripcionControl.setValue(descripcionControl.value.toUpperCase());
      }
      const moneda = this.form.get('moneda')?.value;
      this.form.get('moneda_id')?.setValue( moneda );
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
      this.contraparteControl.setValue(val.contraparte);
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

  onMonedaSelect(mon:Moneda){
    this.moneda = mon;

    if (mon.id !== this.monedaLocal!.id){
      if (!this.data)
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

  private close(data: MovimientoForm): void {
    this.dialogRef.close(data);
  }
}
