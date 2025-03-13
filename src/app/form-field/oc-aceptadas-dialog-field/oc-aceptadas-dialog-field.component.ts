import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { DialogFieldComponent } from '../dialog-field/dialog-field.component';

@Component({
  selector: 'app-oc-aceptadas-dialog-field',
  templateUrl: './oc-aceptadas-dialog-field.component.html',
  styleUrls: ['./oc-aceptadas-dialog-field.component.scss']
})
export class OcAceptadasDialogFieldComponent implements OnInit {
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
  @Input() ocAceptadaEvents?: Observable<OrdenCargaList>;
  @Input() ocAceptada?: OrdenCargaList;
  @Input() form!: FormGroup;
  @Input() controlName = 'id_orden_carga';
  @Input() groupName = '';
  @Input() title = 'ORDEN DE CARGA';
  @Input() emptyHint = 'Sin estado Aceptado';


  @Output() valueChange = new EventEmitter<OrdenCargaList>();

  @ViewChild('app-dialog-field') dialogField?: DialogFieldComponent<OrdenCargaList>;

  list$?: Observable<OrdenCargaList[]>;
  ocEstadoAceptado = false;

  fetchFunction = () => this.ocService.getAceptadosList();

  constructor(private ocService: OrdenCargaService) {}

  private getList(): void {
    this.ocService.getAceptadosList().subscribe({
      next: (data) => {
        // Verifica si alguna orden tiene el estado 'Aceptado'
        const ocAceptada = data.find(oc => oc.estado === 'Aceptado');
        this.ocEstadoAceptado = !!ocAceptada;
        this.ocAceptada = ocAceptada;
        this.list$ = of(data);
      },
      error: (err) => {
        // Manejo del error
        console.error('Error al cargar OC:', err);
        this.ocEstadoAceptado = false;
        this.list$ = of([]);
      }
    });
  }

  ngOnInit(): void {
    this.getList();
    if (this.ocAceptadaEvents) {
      this.ocAceptadaEvents.subscribe(() => this.getList());
    }
  }
}
