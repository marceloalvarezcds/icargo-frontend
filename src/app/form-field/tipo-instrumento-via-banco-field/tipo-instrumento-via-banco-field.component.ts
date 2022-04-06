import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { TipoInstrumento } from 'src/app/interfaces/tipo-instrumento';
import { TipoInstrumentoService } from 'src/app/services/tipo-instrumento.service';

@Component({
  selector: 'app-tipo-instrumento-via-banco-field',
  templateUrl: './tipo-instrumento-via-banco-field.component.html',
  styleUrls: ['./tipo-instrumento-via-banco-field.component.scss'],
})
export class TipoInstrumentoViaBancoFieldComponent {
  list$ = this.service.getListViaBanco();

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_instrumento_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de Instrumento';

  @Output() valueChange = new EventEmitter<TipoInstrumento>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<TipoInstrumento>;

  constructor(private service: TipoInstrumentoService) {}

  textValueFormat(value: TipoInstrumento): string {
    return value.descripcion;
  }

  value(value: TipoInstrumento): number {
    return value.id;
  }
}
