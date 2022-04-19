import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { ContraparteWithId } from 'src/app/interfaces/contraparte-info';
import { ContraparteService } from 'src/app/services/contraparte.service';

@Component({
  selector: 'app-contraparte-field',
  templateUrl: './contraparte-field.component.html',
  styleUrls: ['./contraparte-field.component.scss'],
})
export class ContraparteFieldComponent {
  tipoId?: number | null;
  list$?: Observable<ContraparteWithId[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'contraparte';
  @Input() groupName?: string;
  @Input() title = 'Contraparte';
  @Input() readonly = false;
  @Input() openField = false;
  @Input() set tipoContraparteId(id: number | null | undefined) {
    this.tipoId = id;
    this.getList();
  }

  @Output() emptyListChange = new EventEmitter();
  @Output() valueChange = new EventEmitter<ContraparteWithId>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<ContraparteWithId>;

  constructor(private service: ContraparteService) {}

  textValueFormat(value: ContraparteWithId): string {
    return value.contraparte;
  }

  value(value: ContraparteWithId): string {
    return value.contraparte;
  }

  private getList(): void {
    if (this.tipoId) {
      this.list$ = this.service.getListByTipoContraparteId(this.tipoId);
    }
  }
}
