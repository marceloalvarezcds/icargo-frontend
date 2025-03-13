import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-oc-finalizadas-dialog-field',
  templateUrl: './oc-finalizadas-dialog-field.component.html',
  styleUrls: ['./oc-finalizadas-dialog-field.component.scss']
})
export class OcFinalizadasDialogFieldComponent implements OnInit {
  readonly inputValuePropName = 'id';

  columns: Column[] = [
    { def: 'selector', title: '', sticky: true },
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
      def: 'tracto',
      title: 'Tracto',
      value: (element: OrdenCargaList) => element.camion_placa,
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
      def: 'chapa_tracto',
      title: 'Tracto',
      value: (element: OrdenCargaList) => element.camion_placa,
    },
    {
      def: 'chofer_nombre',
      title: 'Chofer',
      value: (element: OrdenCargaList) => element.chofer_nombre,
    },
    {
      def: 'producto',
      title: 'Producto',
      value: (element: OrdenCargaList) => element.flete_producto_descripcion,
    }
  ];

  @Input() isRemote = false;
  @Input() ocFinalizadaEvents?: Observable<OrdenCargaList>;
  @Input() ocFinalizada?: OrdenCargaList;
  @Input() form!: FormGroup;
  @Input() controlName = 'id_orden_carga';
  @Input() groupName = '';
  @Input() title = 'ORDEN DE CARGA';
  @Input() emptyHint = 'Sin estado Finalizado';

  @Output() valueChange = new EventEmitter<OrdenCargaList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<OrdenCargaList>;

  list$?: Observable<OrdenCargaList[]>;
  ocEstadoFinalizado = false;

  fetchFunction = () => this.ocService.getFinalizadosList();

  constructor(private ocService: OrdenCargaService) {}

  private getList(): void {
    this.ocService.getFinalizadosList().subscribe({
      next: (data) => {
        // Verifica si alguna orden tiene el estado 'Aceptado'
        const ocFinalizada = data.find(oc => oc.estado === 'Finalizado');
        this.ocEstadoFinalizado = !!ocFinalizada;
        this.ocFinalizada = ocFinalizada;
        this.list$ = of(data);
      },
      error: (err) => {
        // Manejo del error
        console.error('Error al cargar OC:', err);
        this.ocEstadoFinalizado = false;
        this.list$ = of([]);
      }
    });
  }

  ngOnInit(): void {
    this.getList();
  }
}
