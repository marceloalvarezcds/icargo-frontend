import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-oc-aceptadas-dialog-field',
  templateUrl: './oc-aceptadas-dialog-field.component.html',
  styleUrls: ['./oc-aceptadas-dialog-field.component.scss']
})
export class OcAceptadasDialogFieldComponent  {
  readonly inputValuePropName = 'id';
  
 columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: OrdenCargaList) => element.created_at,
      type: 'only-date'
    },
    {
      def: 'id',
      title: 'ID',
      value: (element: OrdenCargaList) => element.id,
    },
 
    {
      def: 'origen_nombre',
      title: 'Origen',
      value: (element: OrdenCargaList) => element.origen_nombre,
    },
    {
      def: 'destino_nombre',
      title: 'Destino',
      value: (element: OrdenCargaList) => element.destino_nombre,
    },
  ];

  @Input() ocAceptadaEvents?: Observable<OrdenCargaList>
  @Input() ocAceptada?: OrdenCargaList
  @Input() form!: FormGroup;
  @Input() controlName = 'id_orden_carga';
  @Input() groupName = '';
  @Input() title = 'ORDEN DE CARGA';


  @Output() valueChange = new EventEmitter<OrdenCargaList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<OrdenCargaList>;

  fetchFunction = () => this.ocService.getAceptadosList();

  constructor(private ocService: OrdenCargaService) {}
}
