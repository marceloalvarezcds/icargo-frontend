import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FleteList } from 'src/app/interfaces/flete';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-info',
  templateUrl: './orden-carga-edit-form-info.component.html',
  styleUrls: ['./orden-carga-edit-form-info.component.scss']
})
export class OrdenCargaEditFormInfoComponent {

  @Input() oc?: OrdenCarga;
  @Input() form?: FormGroup;
  @Input() flete?: FleteList;
  @Input() puedeModificar = false;

  get diferenciaOrigenDestino(): number {
    return (this.oc?.cantidad_origen ?? 0) - (this.oc?.cantidad_destino ?? 0);
  }

  get facturaCTR(): string {
    return `/`;
  }

  get tipoFleteProducto(): string {
    return `${this.oc?.flete_tipo} / ${this.oc?.flete_producto_descripcion}`;
  }
}
