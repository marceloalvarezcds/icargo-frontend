import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Insumo } from 'src/app/interfaces/insumo';
import { InsumoService } from 'src/app/services/insumo.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-insumo-by-tipo-field',
  templateUrl: './insumo-by-tipo-field.component.html',
  styleUrls: ['./insumo-by-tipo-field.component.scss']
})
export class InsumoByTipoFieldComponent {

  tId?: number | null;
  list$?: Observable<Insumo[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'insumo_id';
  @Input() groupName?: string;
  @Input() title = 'Insumo';
  @Input() set tipoInsumoId(id: number | null | undefined) {
    this.tId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<Insumo>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<Insumo>;

  constructor(private service: InsumoService) {}

  textValueFormat(value: Insumo): string {
    return value.descripcion;
  }

  value(value: Insumo): number {
    return value.id;
  }

  private getList(): void {
    if (this.tId) {
      this.list$ = this.service.getListByTipoInsumoId(this.tId);
    }
  }
}
