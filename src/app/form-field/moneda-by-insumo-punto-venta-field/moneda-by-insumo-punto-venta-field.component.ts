import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Moneda } from 'src/app/interfaces/moneda';
import { MonedaService } from 'src/app/services/moneda.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-moneda-by-insumo-punto-venta-field',
  templateUrl: './moneda-by-insumo-punto-venta-field.component.html',
  styleUrls: ['./moneda-by-insumo-punto-venta-field.component.scss'],
})
export class MonedaByInsumoPuntoVentaFieldComponent {
  iId?: number | null;
  pId?: number | null;
  list$?: Observable<Moneda[]>;

  @Input() controlName = 'moneda_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Moneda';
  @Input() value: (v: Moneda) => number | string | Moneda = (v: Moneda) => v.id;
  @Input() set insumoId(id: number | null | undefined) {
    this.iId = id;
    this.getList();
  }
  @Input() set puntoVentaId(id: number | null | undefined) {
    this.pId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<Moneda | undefined>();

  @ViewChild('app-generic-list-field')
  genericListFieldComponent?: GenericListFieldComponent<Moneda>;

  constructor(private service: MonedaService) {}

  textValueFormat(value: Moneda): string {
    return value.nombre;
  }

  private getList(): void {
    if (this.iId && this.pId) {
      this.list$ = this.service.getListByInsumoIdAndPuntoVentaId(
        this.iId,
        this.pId
      );
    }
  }
}
