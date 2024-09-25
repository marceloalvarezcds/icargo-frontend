import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoAnticipo } from 'src/app/interfaces/tipo-anticipo';
import { TipoAnticipoService } from 'src/app/services/tipo-anticipo.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';
import { Observable } from 'rxjs';
import { TipoEvaluacion } from 'src/app/interfaces/tipo_evaluacion';
import { TipoEvaluacionService } from 'src/app/services/tipo-evaluacion.service';

@Component({
  selector: 'app-tipo-evaluacion-field',
  templateUrl: './tipo-evaluacion-field.component.html',
  styleUrls: ['./tipo-evaluacion-field.component.scss']
})
export class TipoEvaluacionFieldComponent {
  list$ = this.service.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_evaluacion_id';
  @Input() groupName?: string;
  @Input() title = 'Tipo de anticipo';
  value(value: TipoEvaluacion): number {
    return value.id;
  }

  @Output() valueChange = new EventEmitter<TipoEvaluacion>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<TipoEvaluacion>;

  constructor(private service: TipoEvaluacionService) {}

  textValueFormat(value: TipoEvaluacion): string {
    return value.descripcion;
  }

}
