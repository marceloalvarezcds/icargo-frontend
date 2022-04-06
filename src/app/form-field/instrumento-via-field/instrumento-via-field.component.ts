import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { InstrumentoVia } from 'src/app/interfaces/instrumento-via';
import { InstrumentoViaService } from 'src/app/services/instrumento-via.service';

@Component({
  selector: 'app-instrumento-via-field',
  templateUrl: './instrumento-via-field.component.html',
  styleUrls: ['./instrumento-via-field.component.scss'],
})
export class InstrumentoViaFieldComponent {
  list$ = this.instrumentoViaService.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'via_id';
  @Input() groupName?: string;
  @Input() title = 'Via';

  @Output() valueChange = new EventEmitter<InstrumentoVia>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<InstrumentoVia>;

  constructor(private instrumentoViaService: InstrumentoViaService) {}

  textValueFormat(value: InstrumentoVia): string {
    return value.descripcion;
  }

  value(value: InstrumentoVia): number {
    return value.id;
  }
}
