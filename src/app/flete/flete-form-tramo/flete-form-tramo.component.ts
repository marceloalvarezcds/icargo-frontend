import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CentroOperativo } from 'src/app/interfaces/centro-operativo';

@Component({
  selector: 'app-flete-form-tramo',
  templateUrl: './flete-form-tramo.component.html',
  styleUrls: ['./flete-form-tramo.component.scss'],
})
export class FleteFormTramoComponent {
  groupName = 'tramo';

  @Input() form?: FormGroup;

  @Output() destinoChange = new EventEmitter<CentroOperativo | undefined>();
  @Output() origenChange = new EventEmitter<CentroOperativo | undefined>();
}
