import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoInsumo } from 'src/app/interfaces/tipo-insumo';
import { TipoInsumoService } from 'src/app/services/tipo-insumo.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-insumo-by-flete-field',
  templateUrl: './tipo-insumo-by-flete-field.component.html',
  styleUrls: ['./tipo-insumo-by-flete-field.component.scss']
})
export class TipoInsumoByFleteFieldComponent {

  fId?: number;
  list$?: Observable<TipoInsumo[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_insumo_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de insumo';
  @Input() value: (v: TipoInsumo) => number | string | TipoInsumo = (v: TipoInsumo) => v.id;
  @Input() set fleteId(id: number) {
    this.fId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<TipoInsumo>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<TipoInsumo>;

  constructor(private service: TipoInsumoService) {}

  textValueFormat(value: TipoInsumo): string {
    return value.descripcion;
  }

  private getList(): void {
    if (this.fId) {
      this.list$ = this.service.getListByFleteId(this.fId);
    }
  }
}
