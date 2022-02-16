import { Component, Input } from '@angular/core';
import { FleteAnticipo } from 'src/app/interfaces/flete-anticipo';

@Component({
  selector: 'app-orden-carga-edit-form-anticipos-flete',
  templateUrl: './orden-carga-edit-form-anticipos-flete.component.html',
  styleUrls: ['./orden-carga-edit-form-anticipos-flete.component.scss']
})
export class OrdenCargaEditFormAnticiposFleteComponent {

  @Input() list: FleteAnticipo[] = [];

}
