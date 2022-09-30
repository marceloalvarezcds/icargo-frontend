import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-flete-form-condicion-afectado',
  templateUrl: './flete-form-condicion-afectado.component.html',
  styleUrls: ['./flete-form-condicion-afectado.component.scss'],
})
export class FleteFormCondicionAfectadoComponent {
  groupName = 'condicion';

  @Input() form?: FormGroup;
  @Input() afectado = 'gestor_carga';

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }
}
