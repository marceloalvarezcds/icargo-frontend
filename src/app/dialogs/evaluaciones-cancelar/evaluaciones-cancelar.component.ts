import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EvaluacionDialogData } from 'src/app/interfaces/oc-evaluaciones-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaEvaluacionesHistorial} from 'src/app/interfaces/orden_carga_evaluacion';
import { TipoIncidente } from 'src/app/interfaces/tipo_evaluacion';
import { OrdenCargaEvaluacionesService } from 'src/app/services/orden-carga-evaluaciones.service';

@Component({
  selector: 'app-evaluaciones-cancelar',
  templateUrl: './evaluaciones-cancelar.component.html',
  styleUrls: ['./evaluaciones-cancelar.component.scss']
})
export class EvaluacionesCancelarComponent{
  currentRating: number = 0;
  fotoRegistroFile: File | null = null;
  localidadId?: number;
  paisId?: number;
  isFinalizadoOConciliado: boolean = false;
  tipoEvaluacion?: TipoIncidente
  showComentarios: boolean = false;
  

  form = this.fb.group({
    tipo_incidente: this.data?.tipo_incidente,  
    comentarios: this.data?.comentarios,  
    nota: this.data?.nota,  
  });
 
  get tipoIncidenteControl(): FormControl {
    return this.form.get('tipo_incidente') as FormControl;
  }

  get isTipoEvaluacion(): boolean {
    return this.tipoEvaluacion?.descripcion === 'CANCELADO';
  }

  constructor(
    private ordenCargaEvaluacionService: OrdenCargaEvaluacionesService,
    public dialogRef: MatDialogRef<EvaluacionesCancelarComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: EvaluacionDialogData 
  ) {
    this.form = this.fb.group({
      tipo_incidente: this.data?.tipo_incidente,  
      comentarios: this.data?.comentarios,  
      nota: this.data?.nota,  
      concepto: this.data?.concepto
    });

    this.form.get('tipo_incidente')?.valueChanges.subscribe(value => {
      this.tipoEvaluacion = value; 
      this.showComentarios = value?.descripcion === 'CANCELADO';
    });
  }

  submit() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
  
    console.log('Formulario enviado:', this.form.value); // Log del formulario al enviarlo
    
    if (this.form.valid) {
      console.log('El formulario es válido');
      const tipoIncidente: TipoIncidente = this.tipoIncidenteControl.value;
      const tipoIncidenteId = tipoIncidente?.id;
      const ordenCargaId = this.data?.orden_carga_id;
      const camionId = this.data?.camion_id;
      const semiId = this.data?.semi_id;
      const propietarioID = this.data?.propietario_id;
      const choferID = this.data?.propietario_id;
      const gestorCargaId = this.data?.gestor_carga_id;
      const origenId = this.data?.origen_id;
      const destinoId = this.data?.destino_id;
      const productoId = this.data?.producto_id;
  
      const value = JSON.parse(JSON.stringify(this.form.value));

      const data = {
        ...value,
        tipo_incidente_id: tipoIncidenteId,  
        orden_carga_id: ordenCargaId,  
        camion_id: camionId, 
        semi_id: semiId,
        propietario_id: propietarioID,
        chofer_id: choferID,
        gestor_carga_id: gestorCargaId,
        origen_id: origenId,
        destino_id: destinoId, 
        producto_id: productoId,
      };

      console.log('Datos que se van a enviar:', data); // Log de los datos que se enviarán
  
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
  
      this.ordenCargaEvaluacionService
        .create(formData)
        .subscribe(this.close.bind(this));
      
    } else {
      console.log('El formulario no es válido', this.form.errors); // Log de los errores si el formulario no es válido
    }
  }
  
  
  valueConcepto(item: TipoIncidente): TipoIncidente {
    return item;
  }


  private close(data: OrdenCargaEvaluacionesHistorial): void {
    this.dialogRef.close(data);
  }

  @Input() oc?: OrdenCarga
}
