import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProveedorList } from 'src/app/interfaces/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-proveedor-by-insumo-field',
  templateUrl: './proveedor-by-insumo-field.component.html',
  styleUrls: ['./proveedor-by-insumo-field.component.scss']
})
export class ProveedorByInsumoFieldComponent {

  iId?: number | null;
  list$?: Observable<ProveedorList[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'proveedor_id';
  @Input() groupName?: string;
  @Input() title = 'Proveedor';
  @Input() set insumoId(id: number | null | undefined) {
    this.iId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<ProveedorList>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<ProveedorList>;

  constructor(private service: ProveedorService) {}

  textValueFormat(value: ProveedorList): string {
    return value.nombre;
  }

  value(value: ProveedorList): number {
    return value.id;
  }

  private getList(): void {
    if (this.iId) {
      this.list$ = this.service.getListByInsumoId(this.iId);
    }
  }
}
