import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoMovimiento } from 'src/app/interfaces/tipo-movimiento';
import { TipoMovimientoService } from 'src/app/services/tipo-movimiento.service';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-movimiento-by-cuenta-field',
  templateUrl: './tipo-movimiento-by-cuenta-field.component.html',
  styleUrls: ['./tipo-movimiento-by-cuenta-field.component.scss'],
})
export class TipoMovimientoByCuentaFieldComponent {
  cId?: number;
  list$?: Observable<TipoMovimiento[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_movimiento_id';
  @Input() groupName?: string;
  @Input() title = 'Concepto';
  @Input() set cuentaId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<TipoMovimiento | undefined>();

  @ViewChild('app-generic-list-field')
  GenericListFieldComponent?: GenericListFieldComponent<TipoMovimiento>;

  constructor(private service: TipoMovimientoService) {}

  textValueFormat(value: TipoMovimiento): string {
    return value.descripcion;
  }

  value(value: TipoMovimiento): number {
    return value.id;
  }

  private getList(): void {
    if (this.cId) {
      this.list$ = this.service.getListByCuentaId(this.cId);
    }
  }
}
