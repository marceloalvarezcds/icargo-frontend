import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-anticipo-field',
  templateUrl: './tipo-anticipo-field.component.html',
  styleUrls: ['./tipo-anticipo-field.component.scss']
})
export class TipoAnticipoFieldComponent {

  list$ = this.service.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_anticipo_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de anticipo';
  @Input() value: (v: TipoAnticipo) => number | string | TipoAnticipo = (v: TipoAnticipo) => v.id;

  @Output() valueChange = new EventEmitter<TipoAnticipo>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<TipoAnticipo>;

  constructor(private service: TipoAnticipoService) {}

  textValueFormat(value: TipoAnticipo): string {
    return value.descripcion;
  }
}
