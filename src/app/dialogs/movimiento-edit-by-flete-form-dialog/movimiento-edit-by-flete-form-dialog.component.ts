import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { movimientoFleteEditData } from 'src/app/form-data/movimiento-edit-form-dialog';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { round } from 'src/app/utils/math';

@Component({
  selector: 'app-movimiento-edit-by-flete-form-dialog',
  templateUrl: './movimiento-edit-by-flete-form-dialog.component.html',
  styleUrls: ['./movimiento-edit-by-flete-form-dialog.component.scss'],
})
export class MovimientoEditByFleteFormDialogComponent {
  form = this.fb.group({
    moneda_id: [this.monedaInitialValue, Validators.required],
    tarifa: [this.tarifaInitialValue, Validators.required],
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

  constructor(
    private movimientoService: MovimientoService,
    public dialogRef: MatDialogRef<MovimientoEditByFleteFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: MovimientoFleteEditFormDialogData
  ) {}

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

  private close(data: Movimiento): void {
    this.dialogRef.close(data);
  }
}
