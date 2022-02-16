import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-combinacion',
  templateUrl: './orden-carga-edit-form-combinacion.component.html',
  styleUrls: ['./orden-carga-edit-form-combinacion.component.scss']
})
export class OrdenCargaEditFormCombinacionComponent {

  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() puedeModificar = false;
  @Output() fleteChange = new EventEmitter<FleteList>();

  get placaCamionSemi(): string {
    return `${this.oc?.camion_placa} / ${this.oc?.semi_placa}`;
  }
}
