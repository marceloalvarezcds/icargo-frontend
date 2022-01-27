import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-anticipo-by-flete-field',
  templateUrl: './tipo-anticipo-by-flete-field.component.html',
  styleUrls: ['./tipo-anticipo-by-flete-field.component.scss']
})
export class TipoAnticipoByFleteFieldComponent {

  fId?: number;
  list$?: Observable<TipoAnticipo[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_anticipo_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de anticipo';
  @Input() value: (v: TipoAnticipo) => number | string | TipoAnticipo = (v: TipoAnticipo) => v.id;
  @Input() set fleteId(id: number) {
    this.fId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<TipoAnticipo>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<TipoAnticipo>;

  constructor(private service: TipoAnticipoService) {}

  textValueFormat(value: TipoAnticipo): string {
    return value.descripcion;
  }

  private getList(): void {
    if (this.fId) {
      this.list$ = this.service.getListByFleteId(this.fId);
    }
  }
}
