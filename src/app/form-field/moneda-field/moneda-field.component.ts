import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Moneda } from 'src/app/interfaces/moneda';
import { MonedaService } from 'src/app/services/moneda.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-moneda-field',
  templateUrl: './moneda-field.component.html',
  styleUrls: ['./moneda-field.component.scss'],
})
export class MonedaFieldComponent {
  list$ = this.service.getList();

  @Input() controlName = 'moneda_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = '';
  @Input() value: (v: Moneda) => number | string | Moneda = (v: Moneda) => v.id;

  @Output() valueChange = new EventEmitter<Moneda | undefined>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<Moneda>;

  constructor(private service: MonedaService) {}

  textValueFormat(value: Moneda): string {
    return value.nombre;
  }
}
