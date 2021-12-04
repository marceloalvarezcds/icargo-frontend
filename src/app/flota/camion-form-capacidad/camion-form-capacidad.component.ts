import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-camion-form-capacidad',
  templateUrl: './camion-form-capacidad.component.html',
  styleUrls: ['./camion-form-capacidad.component.scss']
})
export class CamionFormCapacidadComponent {

  groupName = 'capacidad';

  @Input() form?: FormGroup;
  @Input() isShow = false;
}
