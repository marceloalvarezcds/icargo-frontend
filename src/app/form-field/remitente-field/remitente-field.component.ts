import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RemitenteService } from 'src/app/services/remitente.service';

@Component({
  selector: 'app-remitente-field',
  templateUrl: './remitente-field.component.html',
  styleUrls: ['./remitente-field.component.scss']
})
export class RemitenteFieldComponent {

  list$ = this.remitenteService.getListByGestorCuentaId();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'remitente_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() title = 'Remitente';

  constructor(private remitenteService: RemitenteService) { }
}
