import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-camion-form-detalle',
  templateUrl: './camion-form-detalle.component.html',
  styleUrls: ['./camion-form-detalle.component.scss']
})
export class CamionFormDetalleComponent {

  groupName = 'detalle';

  @Input() form?: FormGroup;
  @Input() isShow = false;
}
