import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OrdenCargaRemisionOrigen } from 'src/app/interfaces/orden-carga-remision-origen';
import { OrdenCargaRemisionOrigenService } from 'src/app/services/orden-carga-remision-origen.service';
import { GenericListFieldComponent } from '../generic-list-field/generic-list-field.component';

@Component({
  selector: 'app-orden-carga-remision-origen-field',
  templateUrl: './orden-carga-remision-origen-field.component.html',
  styleUrls: ['./orden-carga-remision-origen-field.component.scss']
})
export class OrdenCargaRemisionOrigenFieldComponent {

  ocId?: number;
  list$?: Observable<OrdenCargaRemisionOrigen[]>;

  @Input() form?: FormGroup;
  @Input() controlName = 'orden_carga_remision_origen_id';
  @Input() groupName?: string;
  @Input() title = 'Nº de documento del Origen';
  @Input() set ordenCargaId(id: number) {
    this.ocId = id;
    this.getList();
  }

  @ViewChild('app-generic-list-field') GenericListFieldComponent?: GenericListFieldComponent<OrdenCargaRemisionOrigen>;

  constructor(private ordenCargaRemisionOrigenService: OrdenCargaRemisionOrigenService) {}

  textValueFormat(value: OrdenCargaRemisionOrigen): string {
    return value.numero_documento;
  }

  value(value: OrdenCargaRemisionOrigen): string {
    return value.numero_documento;
  }

  private getList(): void {
    if (this.ocId) {
      this.list$ = this.ordenCargaRemisionOrigenService.getListByOrdenCargaId(this.ocId);
    }
  }
}
