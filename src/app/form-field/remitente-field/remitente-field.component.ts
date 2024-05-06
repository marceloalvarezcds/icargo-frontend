import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Remitente } from 'src/app/interfaces/remitente';
import { RemitenteService } from 'src/app/services/remitente.service';

@Component({
  selector: 'app-remitente-field',
  templateUrl: './remitente-field.component.html',
  styleUrls: ['./remitente-field.component.scss'],
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
  @Input() readonly = false;
  @Input() title = 'Remitente';

  @Output() valueChange = new EventEmitter<Remitente | undefined>();

  constructor(private remitenteService: RemitenteService) {}

  textValueFormat(value: Remitente): string {
    return value.nombre;
  }

  value(value: Remitente): number {
    return value.id;
  }
}
