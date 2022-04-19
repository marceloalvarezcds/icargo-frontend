import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoContraparte } from 'src/app/interfaces/tipo-contraparte';
import { TipoContraparteService } from 'src/app/services/tipo-contraparte.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-contraparte-field',
  templateUrl: './tipo-contraparte-field.component.html',
  styleUrls: ['./tipo-contraparte-field.component.scss'],
})
export class TipoContraparteFieldComponent {
  list$ = this.service.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_contraparte_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de Contraparte';
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<TipoContraparte>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<TipoContraparte>;

  constructor(private service: TipoContraparteService) {}

  textValueFormat(value: TipoContraparte): string {
    return value.descripcion;
  }

  value(value: TipoContraparte): number {
    return value.id;
  }
}
