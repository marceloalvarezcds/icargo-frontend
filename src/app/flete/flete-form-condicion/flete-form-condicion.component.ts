import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-flete-form-condicion',
  templateUrl: './flete-form-condicion.component.html',
  styleUrls: ['./flete-form-condicion.component.scss']
})
export class FleteFormCondicionComponent {

  groupName = 'condicion';
  @Input() afectado = 'gestor_carga';

  @Input() form?: FormGroup;
}
