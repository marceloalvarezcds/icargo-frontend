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
import { DialogFieldLocalComponent } from '../dialog-field-local/dialog-field-local.component';

@Component({
  selector: 'app-oc-by-combinacion-finalizados-dialog-field',
  templateUrl: './oc-by-combinacion-finalizados-dialog-field.component.html',
  styleUrls: ['./oc-by-combinacion-finalizados-dialog-field.component.scss']
})
export class OcByCombinacionFinalizadosDialogFieldComponent {
  readonly inputValuePropName = 'id';
  cId?: number;
  list$?: Observable<OrdenCargaList[]>;

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: OrdenCargaList) => element.created_at,
      type: 'only-date',
    },
    {
      def: 'id',
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

  @Input() ocEvents?: Observable<OrdenCargaList>;
  @Input() oc?: OrdenCargaList;
  @Input() form!: FormGroup;
  @Input() controlName = 'id_orden_carga';
  @Input() groupName = '';
  @Input() title = 'ORDENES DE CARGA';
  @Input() emptyHint = 'Seleccione Chapa';
  @Input() emptyIdHint = 'Cree una OC';
  @Input() subtitle = 'Si no encuentra al camión deseado se debe a que este no está activo o no tiene chofer asignado o el chofer no está activo';
  @Input() set combinacionId(id: number | undefined) {
    this.cId = id;
    this.getList();
  }

  @Output() valueChange = new EventEmitter<OrdenCargaList | undefined>();

  @ViewChild('app-dialog-field-local') dialogField?: DialogFieldLocalComponent<OrdenCargaList>;

  fetchFunction: any = null;

  constructor(private ocService: OrdenCargaService) {}

  ocEstadoFinalizado = false;

  private getList(): void {
    if (this.cId) {

      this.fetchFunction = () => this.ocService.getListOCByCombinacionIdAnOCFinalizadas(this.cId!);

      this.ocService.getListOCByCombinacionIdAnOCFinalizadas(this.cId).subscribe({
        next: (data) => {
          // Verifica si la respuesta contiene órdenes de carga
          const ocFinalizada = data.find(oc => oc.estado === 'Finalizado');
          this.ocEstadoFinalizado = !!ocFinalizada;
          this.oc = ocFinalizada;
          this.list$ = of(data);
        },
        error: (err) => {
          // Maneja el error
          console.error('Error al cargar OC:', err);
          // Opcionalmente, muestra un mensaje controlado en la UI
          this.ocEstadoFinalizado = false;
          this.list$ = of([]);
        }
      });
    } else {
      // console.warn('No hay combinacionId disponible');
    }
  }

}
