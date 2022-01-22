import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TipoComprobante } from 'src/app/interfaces/tipo-comprobante';
import { TipoComprobanteService } from 'src/app/services/tipo-comprobante.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-tipo-comprobante-field',
  templateUrl: './tipo-comprobante-field.component.html',
  styleUrls: ['./tipo-comprobante-field.component.scss']
})
export class TipoComprobanteFieldComponent {

  list$ = this.tipoComprobanteService.getList();

  @Input() form?: FormGroup;
  @Input() controlName = 'tipo_comprobante_id';
  @Input() groupName = '';
  @Input() title = 'Tipo de comprobante';

  @ViewChild('app-generic-list-field') GenericListFieldComponent?: GenericListFieldComponent<TipoComprobante>;

  constructor(private tipoComprobanteService: TipoComprobanteService) {}

  textValueFormat(value: TipoComprobante): string {
    return value.descripcion;
  }

  value(value: TipoComprobante): number {
    return value.id;
  }
}
