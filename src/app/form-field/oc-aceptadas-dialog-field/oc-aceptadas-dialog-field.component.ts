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
      def: 'id',
      title: 'ID',
      value: (element: OrdenCargaList) => element.id,
    },

    {
      def: 'cliente',
      title: 'Cliente',
      value: (element: OrdenCargaList) => element.flete_remitente_nombre,
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

    {
      def: 'camion_placa',
      title: 'Tracto',
      value: (element: OrdenCargaList) => element.camion_placa,
    },

    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: OrdenCargaList) => element.chofer_nombre,
    },

    {
      def: 'flete_producto_descripcion',
      title: 'Producto',
      value: (element: OrdenCargaList) => element.flete_producto_descripcion,
    }
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
