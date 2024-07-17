import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { FleteList } from 'src/app/interfaces/flete';
import { FleteService } from 'src/app/services/flete.service';

@Component({
  selector: 'app-flete-by-gestor-dialog-field',
  templateUrl: './flete-by-gestor-dialog-field.component.html',
  styleUrls: ['./flete-by-gestor-dialog-field.component.scss'],
})
export class FleteByGestorDialogFieldComponent {
  readonly inputValuePropName = 'info';
  list: FleteList[] = [];
  subs = this.fleteService.getListByGestorCarga().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: FleteList) => element.id,
      sticky: true,
    },
    {
      def: 'remitente_nombre',
      title: 'Cliente',
      value: (element: FleteList) => element.remitente_nombre,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: FleteList) => element.producto_descripcion,
    },
    {
      def: 'tipo_carga_descripcion',
      title: 'Tipo de Carga',
      value: (element: FleteList) => element.tipo_carga_descripcion,
    },
    {
      def: 'numero_lote',
      title: 'Nº de Lote',
      value: (element: FleteList) => element.numero_lote,
    },
    {
      def: 'publicado_descripcion',
      title: 'Publicado',
      value: (element: FleteList) => element.publicado_descripcion,
    },
    {
      def: 'es_subasta',
      title: 'Tipo de Pedido',
      value: (element: FleteList) => (element.es_subasta ? 'Subasta' : 'Flete'),
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: FleteList) => element.estado,
    },
    {
      def: 'gestor_carga_nombre',
      title: 'Gestor de Cuenta',
      value: (element: FleteList) => element.gestor_carga_nombre,
    },
    {
      def: 'origen_nombre',
      title: 'Origen',
      value: (element: FleteList) => element.origen_nombre,
    },
    {
      def: 'origen_indicacion',
      title: 'Origen Indicaciones',
      value: (element: FleteList) => element.origen_indicacion,
    },
    {
      def: 'destino_nombre',
      title: 'Destino',
      value: (element: FleteList) => element.destino_nombre,
    },
    {
      def: 'destino_indicacion',
      title: 'Destino Indicaciones',
      value: (element: FleteList) => element.destino_indicacion,
    },
    {
      def: 'distancia',
      title: 'Distancia',
      value: (element: FleteList) => element.distancia,
    },
    {
      def: 'tipo_flete',
      title: 'Tipo de Pedido',
      value: (element: FleteList) => element.tipo_flete,
    },
    {
      def: 'condicion_cantidad',
      title: 'Cantidad a Transportar',
      value: (element: FleteList) => element.condicion_cantidad,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: FleteList) => element.created_at,
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'flete_id';
  @Input() groupName = '';
  @Input() title = 'Pedido';

  @Output() valueChange = new EventEmitter<FleteList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<FleteList>;

  constructor(private fleteService: FleteService) {}
}
