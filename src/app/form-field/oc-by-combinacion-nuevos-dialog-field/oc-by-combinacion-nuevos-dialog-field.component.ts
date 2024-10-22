import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DialogFieldComponent } from 'src/app/form-field/dialog-field/dialog-field.component';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';

@Component({
  selector: 'app-oc-by-combinacion-nuevos-dialog-field',
  templateUrl: './oc-by-combinacion-nuevos-dialog-field.component.html',
  styleUrls: ['./oc-by-combinacion-nuevos-dialog-field.component.scss']
})
export class OcByCombinacionNuevosDialogFieldComponent {

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
      def: 'id_oc',
      title: 'ID',
      value: (element: OrdenCargaList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: OrdenCargaList) => element.estado,
    },
    {
      def: 'remitente_nombre',
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
      def: 'producto',
      title: 'Producto',
      value: (element: OrdenCargaList) => element.flete_producto_descripcion,
    },
    {
      def: 'precio',
      title: 'Precio',
      value: (element: OrdenCargaList) => element.condicion_gestor_cuenta_tarifa,
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
  @Input() controlName = 'id_orden_carga';
  @Input() groupName = '';
  @Input() title = 'ORDENES DE CARGA';
  @Input() emptyHint = 'Seleccione Chapa';
  @Input() emptyIdHint = 'Cree una OC';
  @Input() subtitle =
  'Si no encuentra al camión deseado se debe a que este no está activo o no tiene chofer asignado o el chofer no está activo';
  
  @Input() set combinacionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }
  
  @Input() oc?: OrdenCargaList;

  @Output() valueChange = new EventEmitter<OrdenCargaList | undefined>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<OrdenCargaList>;

  constructor(private ocService: OrdenCargaService) {}

  ocEstadoNuevo = false;

  private getList(): void {
    if (this.cId) {
      this.ocService.getListOCByCombinacionIdAnOCNuevos(this.cId).subscribe({
        next: (data) => {
          // Verifica si la respuesta contiene órdenes de carga
          const ocNuevo = data.find(oc => oc.estado === 'Nuevo');
          this.ocEstadoNuevo = !!ocNuevo;
          this.oc = ocNuevo;
  
          this.list$ = of(data);
        },
        error: (err) => {
          // Maneja el error
          console.error('Error al cargar OC:', err);
          // Opcionalmente, muestra un mensaje controlado en la UI
          this.ocEstadoNuevo = false;
          this.list$ = of([]);
        }
      });
    } else {
      // console.warn('No hay combinacionId disponible');
    }
  }

}
