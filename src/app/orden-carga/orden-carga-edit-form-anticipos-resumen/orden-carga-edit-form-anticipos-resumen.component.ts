import { Component, Input } from '@angular/core';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';

@Component({
  selector: 'app-orden-carga-edit-form-anticipos-resumen',
  templateUrl: './orden-carga-edit-form-anticipos-resumen.component.html',
  styleUrls: ['./orden-carga-edit-form-anticipos-resumen.component.scss']
})
export class OrdenCargaEditFormAnticiposResumenComponent {

  @Input() oc?: OrdenCarga;

}
