import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { TipoCarga } from 'src/app/interfaces/tipo-carga';
import { SeleccionableService } from 'src/app/services/seleccionable.service';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tipo-cuenta-field',
  templateUrl: './tipo-cuenta-field.component.html',
  styleUrls: ['./tipo-cuenta-field.component.scss'],
  providers: [SeleccionableService],
})
export class TipoCuentaFieldComponent {
  list$: Observable<TipoCarga[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'cuenta_id';
  @Input() groupName?: string;
  @Input() title = 'Cuenta';

  @Output() valueChange = new EventEmitter<TipoCarga | undefined>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<TipoCarga>;

  constructor(private service: SeleccionableService<TipoCarga>) {
    this.service.setEndpoint(m.TIPO_CUENTA);
    this.list$ = this.service.getActiveList();
  }

  textValueFormat(value: TipoCarga): string {
    return value.descripcion;
  }

  value(value: TipoCarga): number {
    return value.id;
  }
}
