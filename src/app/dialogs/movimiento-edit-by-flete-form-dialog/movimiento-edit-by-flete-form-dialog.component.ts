import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { movimientoFleteEditData } from 'src/app/form-data/movimiento-edit-form-dialog';
import { Moneda } from 'src/app/interfaces/moneda';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { round } from 'src/app/utils/math';

@Component({
  selector: 'app-movimiento-edit-by-flete-form-dialog',
  templateUrl: './movimiento-edit-by-flete-form-dialog.component.html',
  styleUrls: ['./movimiento-edit-by-flete-form-dialog.component.scss'],
})
export class MovimientoEditByFleteFormDialogComponent implements OnInit, AfterViewInit {

  monedaLocal?: Moneda;

  form = this.fb.group({
    moneda_id: [this.monedaInitialValue, Validators.required],
    tarifa: [this.tarifaInitialValue, Validators.required],
    tipo_cambio_moneda: [{value:this.tipo_cambio_moneda, disabled:true}, Validators.required],
  });

  get data(): Movimiento {
    return this.dialogData.item;
  }

  get estado(): MovimientoEstadoEnum {
    return this.data.estado;
  }

  get afectado(): AfectadoEnum {
    return this.dialogData.afectado;
  }

  get cantidadDestino(): number {
    return this.data.cantidad_destino ?? 0;
  }

  get monedaInitialValue(): number | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.condicion_gestor_carga_moneda_id
      : this.data.condicion_propietario_moneda_id;
  }

  get tarifa(): number {
    const ctl = this.form.get('tarifa') as FormControl;
    const tarifa = parseFloat(ctl.value);
    return round(tarifa);
  }

  get tarifaInitialValue(): number | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.condicion_gestor_carga_tarifa
      : this.data.condicion_propietario_tarifa;
  }

  get tipo_cambio_moneda(): number  {
    return this.data.tipo_cambio_moneda ?? 1;
  }

  get showCotizacion():boolean {
    const mon = this.form.get('moneda_id') as FormControl;
    if (!this.monedaLocal) return true;
    return this.monedaLocal.id === mon.value;
  }

  constructor(
    private movimientoService: MovimientoService,
    private monedaService: MonedaService,
    private cotizacionService: MonedaCotizacionService,
    public dialogRef: MatDialogRef<MovimientoEditByFleteFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: MovimientoFleteEditFormDialogData
  ) {}

  ngOnInit(): void {
    this.monedaService.getMonedaByGestorId(1).subscribe( (resp:Moneda) => {
      this.monedaLocal = resp;
      if (this.monedaLocal.id !== this.monedaInitialValue) {
        this.form.controls['tipo_cambio_moneda'].enable();
        this.form.controls['tipo_cambio_moneda'].setValidators([Validators.required]);
        this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
      }
    });
  }

  ngAfterViewInit(): void {
    this.form.controls['tipo_cambio_moneda'].setValue(this.tipo_cambio_moneda);
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = movimientoFleteEditData(this.form);
      if (this.afectado === AfectadoEnum.GESTOR) {
        this.movimientoService
          .editByGestorFlete(this.data.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.movimientoService
          .editByPropietarioFlete(this.data.id, formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  monedaChange(moneda: Moneda){
    if (moneda.id !== this.monedaLocal!.id){
      this.cotizacionService.get_cotizacion_by_moneda(moneda.id, this.monedaLocal!.id)
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
      this.form.controls['tipo_cambio_moneda'].setValue(1);
      this.form.controls['tipo_cambio_moneda'].updateValueAndValidity();
    }
  }

  private close(data: Movimiento): void {
    this.dialogRef.close(data);
  }
}
