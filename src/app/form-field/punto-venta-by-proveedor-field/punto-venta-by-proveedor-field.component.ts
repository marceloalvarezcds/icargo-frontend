import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-punto-venta-by-proveedor-field',
  templateUrl: './punto-venta-by-proveedor-field.component.html',
  styleUrls: ['./punto-venta-by-proveedor-field.component.scss']
})
export class PuntoVentaByProveedorFieldComponent {

  pId?: number | null;
  list$?: Observable<PuntoVentaList[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'punto_venta_id';
  @Input() groupName?: string;
  @Input() title = 'Punto de Venta';
  @Input() set proveedorId(id: number | null | undefined) {
    this.pId = id;
    this.getList();
  }
  @Input() value: (v: PuntoVentaList) => number | string | PuntoVentaList = (v: PuntoVentaList) => v.id;

  @Output() valueChange = new EventEmitter<PuntoVentaList>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<PuntoVentaList>;

  constructor(private service: PuntoVentaService) {}

  textValueFormat(value: PuntoVentaList): string {
    return value.nombre_corto!;
  }

  private getList(): void {
    if (this.pId) {
      this.list$ = this.service.getList(this.pId);
    }
  }
}
