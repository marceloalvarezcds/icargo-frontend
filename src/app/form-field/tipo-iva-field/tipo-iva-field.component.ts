import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoIva } from 'src/app/interfaces/tipo-iva';
import { TipoIvaService } from 'src/app/services/tipo-iva.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-iva-field',
  templateUrl: './tipo-iva-field.component.html',
  styleUrls: ['./tipo-iva-field.component.scss'],
})
export class TipoIvaFieldComponent {
  list$ = this.service.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'iva_id';
  @Input() groupName?: string;
  @Input() title = 'IVA';

  @Output() valueChange = new EventEmitter<TipoIva>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<TipoIva>;

  constructor(private service: TipoIvaService) {}

  textValueFormat(value: TipoIva): string {
    return value.descripcion;
  }

  value(value: TipoIva): number {
    return value.id;
  }
}
