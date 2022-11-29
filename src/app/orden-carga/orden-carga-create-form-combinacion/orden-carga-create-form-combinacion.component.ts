import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CamionList } from 'src/app/interfaces/camion';
import { FleteList } from 'src/app/interfaces/flete';
import { SemiList } from 'src/app/interfaces/semi';

@Component({
  selector: 'app-orden-carga-create-form-combinacion',
  templateUrl: './orden-carga-create-form-combinacion.component.html',
  styleUrls: ['./orden-carga-create-form-combinacion.component.scss'],
})
export class OrdenCargaCreateFormCombinacionComponent {
  flete?: FleteList;
  groupName = 'combinacion';
  camionId?: number;

  @Input() form?: FormGroup;
  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() camionChange = new EventEmitter<CamionList>();
  @Output() semiChange = new EventEmitter<SemiList>();

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

  onCamionChange(camion: CamionList | undefined): void {
    if (camion) {
      this.camionId = camion.id;
      this.camionChange.emit(camion);
    }
  }

  onSemiChange(semi: SemiList | undefined): void {
    if (semi) {
      this.semiChange.emit(semi);
    }
  }
}
