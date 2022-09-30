import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CentroOperativo } from 'src/app/interfaces/centro-operativo';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';

@Component({
  selector: 'app-centro-operativo-field',
  templateUrl: './centro-operativo-field.component.html',
  styleUrls: ['./centro-operativo-field.component.scss'],
})
export class CentroOperativoFieldComponent {
  list$ = this.service.getListByGestorCuentaId();

  get group(): FormGroup {
    return this.form!.get(this.groupName) as FormGroup;
  }

  get control(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  @Input() controlName = 'centro_operativo_id';
  @Input() form?: FormGroup;
  @Input() groupName = '';
  @Input() readonly = false;
  @Input() title = 'Centro Operativo';

  @Output() valueChange = new EventEmitter<CentroOperativo | undefined>();

  constructor(private service: CentroOperativoService) {}

  textValueFormat(value: CentroOperativo): string {
    return value.nombre;
  }

  value(value: CentroOperativo): number {
    return value.id;
  }
}
