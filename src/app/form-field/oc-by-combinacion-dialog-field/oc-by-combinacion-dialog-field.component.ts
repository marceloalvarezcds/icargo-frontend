import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { FleteService } from 'src/app/services/flete.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';

@Component({
  selector: 'app-oc-by-combinacion-dialog-field',
  templateUrl: './oc-by-combinacion-dialog-field.component.html',
  styleUrls: ['./oc-by-combinacion-dialog-field.component.scss']
})
export class OcByCombinacionDialogFieldComponent  {
  readonly inputValuePropName = 'id';
  cId?: number;
  list$?: Observable<OrdenCargaList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: OrdenCargaList) => this.formatDate(element.created_at),
    },
    {
      def: 'id',
      title: 'ID',
      value: (element: OrdenCargaList) => element.id,
    },
    {
      def: 'remitente_nombre',
      title: 'Cliente',

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
      def: 'producto',
      title: 'Producto',

    },
    {
      def: 'precio',
      title: 'Precio',

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
  @Input() controlName = 'id';
  @Input() groupName = '';
  @Input() title = 'OC  ';
  @Input() emptyHint =
  'No existen camiones. Debe crearlos/activarlos, asignarles un chofer, activar el chofer asignado o crear una combinación';
@Input() subtitle =
  'Si no encuentra al camión deseado se debe a que este no está activo o no tiene chofer asignado o el chofer no está activo';
  
  @Input() set combinacionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }

  
  @Output() valueChange = new EventEmitter<OrdenCargaList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<OrdenCargaList>;

  constructor(private ocService: OrdenCargaService) {}

  private getList(): void {
    if (this.cId) {
      this.list$ = this.ocService.getListOCByCombinacionId(this.cId);
    }
  }

}
