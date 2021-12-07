import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-semi-form-capacidad',
  templateUrl: './semi-form-capacidad.component.html',
  styleUrls: ['./semi-form-capacidad.component.scss']
})
export class SemiFormCapacidadComponent {

  groupName = 'capacidad';

  @Input() form?: FormGroup;
  @Input() isShow = false;
}
