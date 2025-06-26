import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Component({
  selector: 'app-insumo-by-punto-venta-field',
  templateUrl: './insumo-by-punto-venta-field.component.html',
  styleUrls: ['./insumo-by-punto-venta-field.component.scss']
})
export class InsumoByPuntoVentaFieldComponent {


  fId?: number;
  list$?: Observable<InsumoPuntoVentaPrecioList[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'insumo_id';
  @Input() groupName?: string;
  @Input() title = 'Descripcion';
  @Input() value: (v: InsumoPuntoVentaPrecioList) => number | string | InsumoPuntoVentaPrecioList = (v: InsumoPuntoVentaPrecioList) => v.id;
  @Input() set puntoVentaId(id: number) {
    this.fId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<InsumoPuntoVentaPrecioList>();

  @ViewChild('app-generic-list-field') genericListFieldComponent?: GenericListFieldComponent<InsumoPuntoVentaPrecioList>;

  constructor(private service: InsumoPuntoVentaPrecioService) {}

  textValueFormat(value: InsumoPuntoVentaPrecioList): string {
    return value.insumo_descripcion || ' '
      || numberWithCommas(value.precio) || ' '
      || value.insumo_moneda_simbolo || '/'
      || (value.insumo_unidad_abreviatura ?? '');
  }

  private getList(): void {
    if (this.fId) {
    this.list$ = this.service.getListByPuntoVentaId(this.fId);
    }
  }

}
