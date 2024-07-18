import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CamionList } from 'src/app/interfaces/camion';
import { FleteList } from 'src/app/interfaces/flete';
import { SemiList } from 'src/app/interfaces/semi';
import { CamionService } from 'src/app/services/camion.service';
import { FleteService } from 'src/app/services/flete.service';
import { SemiService } from 'src/app/services/semi.service';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss'],
})
export class OrdenCargaCreateFormCombinacionComponent {
  flete?: FleteList;
  groupName = 'combinacion';
  camionId?: number;
  semiAsociado?: number;
  semi?: SemiList;
  camionesDisponibles: CamionList[] = [];
  @Input() form?: FormGroup;
  
  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() camionChange = new EventEmitter<CamionList>();
  @Output() semiChange = new EventEmitter<SemiList>();

  get info(): FormGroup | undefined{
    return this.form?.get('info') as FormGroup;
  }

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get productoId(): number | undefined {
    return this.flete ? this.flete.producto_id : undefined;
  }

  onFleteChange(flete: FleteList): void {
    this.flete = flete;
    this.fleteChange.emit(flete);
    this.fleteService.getList().subscribe(
      (fletes: FleteList[]) => {
        if (fletes && fletes.length > 0) {
          const flete = fletes[0]; 
          this.form?.get(this.groupName)?.get('numero_lote')?.setValue(flete.numero_lote); 
          this.form?.get(this.groupName)?.get('pedido_id')?.setValue(flete.id); 
          this.form?.get(this.groupName)?.get('saldo')?.setValue(flete.condicion_cantidad); 
          this.form?.get(this.groupName)?.get('cliente')?.setValue(flete.remitente_nombre);
          this.form?.get(this.groupName)?.get('producto_descripcion')?.setValue(flete.producto_descripcion); 
          this.form?.get(this.groupName)?.get('origen_nombre')?.setValue(flete.origen_nombre); 
          this.form?.get(this.groupName)?.get('destino_nombre')?.setValue(flete.destino_nombre); 
          this.form?.get(this.groupName)?.get('tipo_flete')?.setValue(flete.tipo_flete); 
          this.form?.get(this.groupName)?.get('a_pagar')?.setValue(flete.merma_gestor_carga_unidad_descripcion); 
          this.form?.get(this.groupName)?.get('valor')?.setValue(flete.condicion_cantidad); 
        }
      },
    );
  }

  constructor(private service: SemiService, private camionService: CamionService, private fleteService: FleteService) {}
  
  onSemiChange(semi: SemiList | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
    
  }

  onCamionChange(camion: CamionList | undefined): void {
    if (camion) {
      this.camionId = camion.id;
      this.camionChange.emit(camion);
      this.camionService.getListByCamionId(camion.id).subscribe(
        (camiones: CamionList[]) => {
          if (camiones && camiones.length > 0) {
            const camion = camiones[0]; 
            this.form?.get(this.groupName)?.get('marca_camion')?.setValue(camion.marca_descripcion); 
            this.form?.get(this.groupName)?.get('color_camion')?.setValue(camion.marca_descripcion); 
            this.form?.get(this.groupName)?.get('propietario_camion')?.setValue(camion.propietario_nombre);
            this.form?.get(this.groupName)?.get('propietario_camion_doc')?.setValue(camion.propietario_ruc);  
            this.form?.get(this.groupName)?.get('chofer_camion')?.setValue(camion.chofer_nombre);
            this.form?.get(this.groupName)?.get('chofer_camion_doc')?.setValue(camion.chofer_numero_documento);
          }
        },
      );
      this.service.getListByCamionId(camion.id).subscribe(
        (semis: SemiList[]) => {
          if (semis && semis.length > 0) {
            const semi = semis[0]; 
            this.form?.get(this.groupName)?.get('semi_id')?.setValue(semi.id); 
            this.form?.get(this.groupName)?.get('marca_semi')?.setValue(semi.marca_descripcion); 
            this.form?.get(this.groupName)?.get('color_semi')?.setValue(semi.color_descripcion); 
            this.form?.get(this.groupName)?.get('semi_placa')?.setValue(semi.placa); 
          }
        },
      );
    }
  }
  
}
