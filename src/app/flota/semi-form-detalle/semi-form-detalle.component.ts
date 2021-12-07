import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-semi-form-detalle',
  templateUrl: './semi-form-detalle.component.html',
  styleUrls: ['./semi-form-detalle.component.scss']
})
export class SemiFormDetalleComponent {

  groupName = 'detalle';

  @Input() form?: FormGroup;
  @Input() isShow = false;
}
