import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericListFieldComponent } from 'src/app/form-field/generic-list-field/generic-list-field.component';
import { Unidad } from 'src/app/interfaces/unidad';
import { UnidadService } from 'src/app/services/unidad.service';

@Component({
  selector: 'app-unidad-field',
  templateUrl: './unidad-field.component.html',
  styleUrls: ['./unidad-field.component.scss']
})
export class UnidadFieldComponent {

  list$ = this.unidadService.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'unidad_id';
  @Input() groupName?: string;
  @Input() title = 'Unidad';

  @ViewChild('app-generic-list-field') GenericListFieldComponent?: GenericListFieldComponent<Unidad>;

  constructor(private unidadService: UnidadService) { }

  textValueFormat(value: Unidad): string {
    return value.descripcion;
  }

  value(value: Unidad): number {
    return value.id;
  }
}
