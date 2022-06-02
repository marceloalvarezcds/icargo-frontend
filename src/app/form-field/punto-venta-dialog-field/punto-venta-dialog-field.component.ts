import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Column } from 'src/app/interfaces/column';
import { PuntoVentaList } from 'src/app/interfaces/punto-venta';
import { PuntoVentaService } from 'src/app/services/punto-venta.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-punto-venta-dialog-field',
  templateUrl: './punto-venta-dialog-field.component.html',
  styleUrls: ['./punto-venta-dialog-field.component.scss'],
})
export class PuntoVentaDialogFieldComponent {
  list: PuntoVentaList[] = [];
  subs = this.service.getListByGestor().subscribe((list) => {
    this.list = list;
  });

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'id',
      title: 'Nº',
      value: (element: PuntoVentaList) => element.id,
      sticky: true,
    },
    {
      def: 'punto_venta_nombre',
      title: 'Punto de Venta',
      value: (element: PuntoVentaList) => element.nombre,
    },
    {
      def: 'proveedor_nombre',
      title: 'Proveedor',
      value: (element: PuntoVentaList) => element.proveedor_nombre,
    },
    {
      def: 'ciudad_nombre',
      title: 'Ciudad',
      value: (element: PuntoVentaList) => element.ciudad_nombre,
    },
    {
      def: 'localidad_nombre',
      title: 'Localidad',
      value: (element: PuntoVentaList) => element.localidad_nombre,
    },
    {
      def: 'pais_nombre',
      title: 'País',
      value: (element: PuntoVentaList) =>
        element.pais_nombre
          ? `${element.pais_nombre} | ${element.pais_nombre_corto}`
          : '',
    },
  ];

  @Input() form!: FormGroup;
  @Input() controlName = 'punto_venta_id';
  @Input() groupName = '';
  @Input() title = 'Punto de Venta';

  @Output() valueChange = new EventEmitter<PuntoVentaList>();

  @ViewChild('app-dialog-field')
  dialogField?: DialogFieldComponent<PuntoVentaList>;

  constructor(private service: PuntoVentaService) {}

  inputValueFormat(value: PuntoVentaList | undefined): string {
    return value ? value.nombre : '';
  }
}
