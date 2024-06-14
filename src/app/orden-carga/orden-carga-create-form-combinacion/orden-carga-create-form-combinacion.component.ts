import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CamionList } from 'src/app/interfaces/camion';
import { FleteList } from 'src/app/interfaces/flete';
import { SemiList } from 'src/app/interfaces/semi';
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
  }

  constructor(private service: SemiService) {}
  
  onSemiChange(semi: SemiList | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
  }

  onCamionChange(camion: CamionList | undefined): void {
    if (camion) {
      this.camionId = camion.id;
      this.camionChange.emit(camion);

      this.service.getListByCamionId(camion.id).subscribe(
        (semis: SemiList[]) => {
          if (semis && semis.length > 0) {
            const semi = semis[0]; 
            this.form?.get(this.groupName)?.get('semi_id')?.setValue(semi.id); 
            this.form?.get(this.groupName)?.get('semi_details')?.setValue(semi.info); 
            this.form?.get(this.groupName)?.get('semi_id')?.setValue(null); 
            this.form?.get(this.groupName)?.get('semi_details')?.setValue(null); 
          }
        },
        (error) => {
          console.error('Error al obtener semirremolques asociados', error);
          this.form?.get(this.groupName)?.get('semi_id')?.setValue(null); 
          this.form?.get(this.groupName)?.get('semi_details')?.setValue(null); 
        }
      );
    }
  }
  
}
