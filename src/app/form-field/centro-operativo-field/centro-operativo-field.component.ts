import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';

@Component({
  selector: 'app-centro-operativo-field',
  templateUrl: './centro-operativo-field.component.html',
  styleUrls: ['./centro-operativo-field.component.scss']
})
export class CentroOperativoFieldComponent {

  list$ = this.centroOperativoService.getListByGestorCuentaId();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'centro_operativo_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Centro Operativo';

  constructor(private centroOperativoService: CentroOperativoService) { }
}
