import {
  Component,
  ElementRef,
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

  readonly inputValuePropName = 'id';
  list: FleteList[] = [];
  subs = this.fleteService.getListByGestorCarga().subscribe((list) => {
    this.list = list;
  });
  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: FleteList) => this.formatDate(element.created_at),
    },
    {
      def: 'id',
      title: 'ID',
      value: (element: FleteList) => element.id,
    },
    {
      def: 'remitente_nombre',
      title: 'Cliente',
      value: (element: FleteList) => element.remitente_nombre,
    },
    {
      def: 'origen_nombre',
      title: 'Origen',
      value: (element: FleteList) => element.origen_nombre,
    },
    {
      def: 'destino_nombre',
      title: 'Destino',
      value: (element: FleteList) => element.destino_nombre,
    },
    {
      def: 'producto',
      title: 'Producto',
      value: (element: FleteList) => element.producto_descripcion,
    },
    {
      def: 'precio',
      title: 'Precio',
      value: (element: FleteList) => element.condicion_gestor_carga_tarifa,
    },


  ];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  @Input() form!: FormGroup;
  @Input() controlName = 'flete_id';
  @Input() groupName = '';
  @Input() title = 'PEDIDOS';

  
  @Output() valueChange = new EventEmitter<FleteList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<FleteList >;

  constructor(private fleteService: FleteService) {}
  

}
