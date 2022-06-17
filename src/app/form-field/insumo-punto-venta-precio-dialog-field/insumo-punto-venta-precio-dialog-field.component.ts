import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-insumo-punto-venta-precio-dialog-field',
  templateUrl: './insumo-punto-venta-precio-dialog-field.component.html',
  styleUrls: ['./insumo-punto-venta-precio-dialog-field.component.scss'],
})
export class InsumoPuntoVentaPrecioDialogFieldComponent {
  readonly inputValuePropName = 'punto_venta_nombre';
  list: InsumoPuntoVentaPrecioList[] = [];
  subs = this.service.getList().subscribe((list) => {
    this.list = list;
  });

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: InsumoPuntoVentaPrecioList) => element.id,
      sticky: true,
    },
    {
      def: 'punto_venta_nombre',
      title: 'Punto de Venta',
      value: (element: InsumoPuntoVentaPrecioList) =>
        element.punto_venta_nombre,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: InsumoPuntoVentaPrecioList) => element.proveedor_nombre,
    },
    {
      def: 'insumo_tipo_descripcion',
      title: 'Tipo de Insumo',
      value: (element: InsumoPuntoVentaPrecioList) =>
        element.insumo_tipo_descripcion,
    },
    {
      def: 'insumo_descripcion',
      title: 'Insumo',
      value: (element: InsumoPuntoVentaPrecioList) =>
        element.insumo_descripcion,
    },
    {
      def: 'insumo_moneda_nombre',
      title: 'Moneda',
      value: (element: InsumoPuntoVentaPrecioList) =>
        element.insumo_moneda_nombre,
    },
    {
      def: 'precio',
      title: 'Precio',
      value: (element: InsumoPuntoVentaPrecioList) => element.precio,
    },
    {
      def: 'ciudad_nombre',
      title: 'Ciudad',
      value: (element: InsumoPuntoVentaPrecioList) => element.ciudad_nombre,
    },
    {
      def: 'localidad_nombre',
      title: 'Localidad',
      value: (element: InsumoPuntoVentaPrecioList) => element.localidad_nombre,
    },
    {
      def: 'pais_nombre',
      title: 'País',
      value: (element: InsumoPuntoVentaPrecioList) =>
        element.pais_nombre
          ? `${element.pais_nombre} | ${element.pais_nombre_corto}`
          : '',
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'insumo_punto_venta_precio_id';
  @Input() groupName = '';
  @Input() title = 'Punto de Venta';

  @Output() valueChange = new EventEmitter<InsumoPuntoVentaPrecioList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<InsumoPuntoVentaPrecioList>;

  constructor(private service: InsumoPuntoVentaPrecioService) {}
}
