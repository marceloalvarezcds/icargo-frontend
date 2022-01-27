import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Proveedor } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-proveedor-field',
  templateUrl: './proveedor-field.component.html',
  styleUrls: ['./proveedor-field.component.scss']
})
export class ProveedorFieldComponent {

  list$ = this.service.getListByGestorCuentaId();

  @Input() controlName = 'proveedor_id';
  @Input() form?: FormGroup;
  @Input() groupName?: string;
  @Input() title = 'Proveedor';
  @Input() value: (v: Proveedor) => number | string | Proveedor = (v: Proveedor) => v.id;

  @Output() valueChange = new EventEmitter<Proveedor>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<Proveedor>;

  constructor(private service: ProveedorService) {}

  textValueFormat(value: Proveedor): string {
    return value.nombre;
  }
}
