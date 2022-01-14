import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-info',
  templateUrl: './orden-carga-edit-form-info.component.html',
  styleUrls: ['./orden-carga-edit-form-info.component.scss']
})
export class OrdenCargaEditFormInfoComponent {

  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() flete?: FleteList;
  @Input() puedeModificar = false;

}
