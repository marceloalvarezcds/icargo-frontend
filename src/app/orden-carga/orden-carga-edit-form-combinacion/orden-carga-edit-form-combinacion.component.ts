import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-combinacion',
  templateUrl: './orden-carga-edit-form-combinacion.component.html',
  styleUrls: ['./orden-carga-edit-form-combinacion.component.scss']
})
export class OrdenCargaEditFormCombinacionComponent {
  combinacionId?: number;
  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() puedeModificar = false;
  @Output() fleteChange = new EventEmitter<FleteList>();
  @Output() combinacionChange = new EventEmitter<CombinacionList>();

  get placaCamionSemi(): string {
    return `${this.oc?.camion_placa} / ${this.oc?.semi_placa}`;
  }
}
