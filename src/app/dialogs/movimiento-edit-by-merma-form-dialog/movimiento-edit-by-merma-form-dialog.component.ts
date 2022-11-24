import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { movimientoMermaEditData } from 'src/app/form-data/movimiento-edit-form-dialog';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoMermaEditFormDialogData } from 'src/app/interfaces/movimiento-merma-edit-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { round } from 'src/app/utils/math';

@Component({
  selector: 'app-movimiento-edit-by-merma-form-dialog',
  templateUrl: './movimiento-edit-by-merma-form-dialog.component.html',
  styleUrls: ['./movimiento-edit-by-merma-form-dialog.component.scss'],
})
export class MovimientoEditByMermaFormDialogComponent {
  form = this.fb.group({
    valor: [this.valorInitialValue, Validators.required],
    moneda_id: [this.monedaInitialValue, Validators.required],
    es_porcentual: [this.esPorcentualInitialValue, Validators.required],
    tolerancia: [this.toleranciaInitialValue, Validators.required],
  });

  get afectado(): AfectadoEnum {
    return this.dialogData.afectado;
  }

  get data(): Movimiento {
    return this.dialogData.item;
  }

  get esPorcentualControl(): FormControl {
    return this.form.controls['es_porcentual'] as FormControl;
  }

  get esPorcentual(): boolean {
    return !!this.esPorcentualControl.value;
  }

  get esPorcentualInitialValue(): boolean | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.merma_gestor_carga_es_porcentual
      : this.data.merma_propietario_es_porcentual;
  }

  get estado(): MovimientoEstadoEnum {
    return this.data.estado;
  }

  get cantidadDestino(): number {
    return this.data.cantidad_destino ?? 0;
  }

  get monedaInitialValue(): number | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.merma_gestor_carga_moneda_id
      : this.data.merma_propietario_moneda_id;
  }

  get tolerancia(): number {
    const ctl = this.form.get('tolerancia') as FormControl;
    const tolerancia = parseFloat(ctl.value);
    return round(tolerancia);
  }

  get toleranciaInitialValue(): number | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.merma_gestor_carga_tolerancia
      : this.data.merma_propietario_tolerancia;
  }

  get valor(): number {
    const ctl = this.form.get('valor') as FormControl;
    const valor = parseFloat(ctl.value);
    return round(valor);
  }

  get valorInitialValue(): number | null {
    return this.afectado === AfectadoEnum.GESTOR
      ? this.data.merma_gestor_carga_valor
      : this.data.merma_propietario_valor;
  }

  constructor(
    private movimientoService: MovimientoService,
    public dialogRef: MatDialogRef<MovimientoEditByMermaFormDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private dialogData: MovimientoMermaEditFormDialogData
  ) {}

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formData = movimientoMermaEditData(this.form);
      if (this.afectado === AfectadoEnum.GESTOR) {
        this.movimientoService
          .editByGestorMerma(this.data.id, formData)
          .subscribe(this.close.bind(this));
      } else {
        this.movimientoService
          .editByPropietarioMerma(this.data.id, formData)
          .subscribe(this.close.bind(this));
      }
    }
  }

  private close(data: Movimiento): void {
    this.dialogRef.close(data);
  }
}
