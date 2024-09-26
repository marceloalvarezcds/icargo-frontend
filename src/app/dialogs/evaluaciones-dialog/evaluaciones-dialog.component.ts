
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EvaluacionDialogData } from 'src/app/interfaces/oc-evaluaciones-dialog-data';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaEvaluacionesHistorial} from 'src/app/interfaces/orden_carga_evaluacion';


@Component({
  selector: 'app-evaluaciones-dialog',
  templateUrl: './evaluaciones-dialog.component.html',
  styleUrls: ['./evaluaciones-dialog.component.scss']
})
export class EvaluacionesDialogComponent {

  fotoRegistroFile: File | null = null;
  localidadId?: number;
  paisId?: number;

  form = this.fb.group({
    orden_carga_id: [this.data?.orden_carga_id, Validators.required], 
    comentario: [this.data?.comentario],                            
    tipo_incidente_id: [this.data?.tipo_incidente_id],                
    gestor_carga_id: [this.data?.gestor_carga_id, Validators.required], 
    camion_id: [this.data?.camion_id, Validators.required],          
    semi_id: [this.data?.semi_id],                                   
    propietario_id: [this.data?.propietario_id],                     
    chofer_id: [this.data?.chofer_id],                                
    origen_id: [this.data?.origen_id, Validators.required],           
    destino_id: [this.data?.destino_id, Validators.required],         
    producto_id: [this.data?.producto_id],                            
    concepto: [this.data?.concepto],                                  
    nota: [this.data?.nota],                                          
    comentarios: [this.data?.comentarios],                            
  });
  
  get data(): OrdenCargaEvaluacionesHistorial | undefined {
    return this.dialogData?.item;
  }


   constructor(
    public dialogRef: MatDialogRef<EvaluacionesDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private dialogData: EvaluacionDialogData
  ) {}


}
