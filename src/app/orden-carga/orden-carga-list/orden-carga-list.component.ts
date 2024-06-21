import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { OrdenCargaList } from 'src/app/interfaces/orden-carga';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  estado?: string;
  producto?: string;
};

@Component({
  selector: 'app-orden-carga-list',
  templateUrl: './orden-carga-list.component.html',
  styleUrls: ['./orden-carga-list.component.scss'],
})
export class OrdenCargaListComponent implements OnInit {
  modelo = m.ORDEN_CARGA;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: OrdenCargaList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: OrdenCargaList) => element.estado,
      sticky: true,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: OrdenCargaList) => element.created_at,
      type: 'date',
      sticky: true,
    },
    {
      def: 'nro_tickets',
      title: 'Comprobantes',
      value: (element: OrdenCargaList) => element.nro_tickets,
    },
    {
      def: 'anticipos_liberados_descripcion',
      title: 'Estado Anticipos',
      value: (element: OrdenCargaList) =>
        element.anticipos_liberados_descripcion,
    },
    {
      def: 'camion_placa',
      title: 'Tracto',
      value: (element: OrdenCargaList) => element.camion_placa,
    },
    {
      def: 'semi_placa',
      title: 'Semi',
      value: (element: OrdenCargaList) => element.semi_placa,
    },

    // {
    //   def: 'comentarios',
    //   title: 'Comentarios',
    //   value: (element: OrdenCargaList) => element.comentarios,
    // },
    // {
    //   def: 'gestor_carga_nombre',
    //   title: 'Gestor de Cuenta',
    //   value: (element: OrdenCargaList) => element.gestor_carga_nombre,
    // },
    // {
    //   def: 'remisiones',
    //   title: 'Remisiones',
    //   value: (element: OrdenCargaList) => element.remisiones,
    // },


    {
      def: 'camion_chofer_nombre',
      title: 'Chofer',
      value: (element: OrdenCargaList) => element.camion_chofer_nombre,
    },
    {
      def: 'flete_id',
      title: 'Pedido',
      value: (element: OrdenCargaList) => element.flete_id,
    },
    {
      def: 'flete_remitente_nombre',
      title: 'Cliente',
      value: (element: OrdenCargaList) => element.flete_remitente_nombre,
    },
    // {
    //   def: 'camion_propietario_nombre',
    //   title: 'Propietario',
    //   value: (element: OrdenCargaList) => element.camion_propietario_nombre,
    // },
    // {
    //   def: 'flete_tipo',
    //   title: 'Tipo de Flete',
    //   value: (element: OrdenCargaList) => element.flete_tipo,
    // },
    {
      def: 'flete_producto_descripcion',
      title: 'Producto',
      value: (element: OrdenCargaList) => element.flete_producto_descripcion,
    },
    {
      def: 'flete_origen_nombre',
      title: 'Origen',
      value: (element: OrdenCargaList) => element.flete_origen_nombre,
    },
    {
      def: 'flete_destino_nombre',
      title: 'Destino',
      value: (element: OrdenCargaList) => element.flete_destino_nombre,
    },
    {
      def: 'condicion_propietario_tarifa',
      title: 'A Cobrar',
      value: (element: OrdenCargaList) => element.condicion_propietario_tarifa,
    },    
    {
      def: 'cantidad_nominada',
      title: 'Cant. Nominada',
      value: (element: OrdenCargaList) => element.cantidad_nominada,
      type: 'number',
    },
    // {
    //   def: 'cantidad_origen',
    //   title: 'Cant. Origen (kg)',
    //   value: (element: OrdenCargaList) => element.cantidad_origen,
    //   type: 'number',
    // },
    // {
    //   def: 'cantidad_destino',
    //   title: 'Cant. Destino (kg)',
    //   value: (element: OrdenCargaList) => element.cantidad_destino,
    //   type: 'number',
    // },
    // {
    //   def: 'origen_nombre',
    //   title: 'Lugar de Carga',
    //   value: (element: OrdenCargaList) => element.origen_nombre,
    // },
    // {
    //   def: 'destino_nombre',
    //   title: 'Lugar de Descarga',
    //   value: (element: OrdenCargaList) => element.destino_nombre,
    // },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: OrdenCargaList) => element.created_by,
    },
 
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: OrdenCargaList) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: OrdenCargaList) => element.modified_at,
    //   type: 'date',
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: OrdenCargaList[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  productoFilterList: string[] = [];
  productoFiltered: string[] = [];

  get isFilteredByEstado(): boolean {
    return this.estadoFiltered.length !== this.estadoFilterList.length;
  }

  get isFilteredByProducto(): boolean {
    return this.productoFiltered.length !== this.productoFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('productoCheckboxFilter')
  productoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private ordenCargaService: OrdenCargaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<OrdenCargaList>): void {
    this.router.navigate([
      `/orden-carga/${m.ORDEN_CARGA}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<OrdenCargaList>): void {
    this.router.navigate([
      `/orden-carga/${m.ORDEN_CARGA}/${a.VER}`,
      event.row.id,
    ]);
  }

  deleteRow({ row }: TableEvent<OrdenCargaList>): void {
    const message = `¿Está seguro que desea eliminar el OrdenCarga con Nº ${row.id}?`;
    this.dialog.confirmationToDelete(
      message,
      this.ordenCargaService.delete(row.id),
      (_) => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.ordenCargaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: OrdenCargaList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByProducto =
      filter.producto
        ?.split('|')
        .some(
          (x) => obj.flete_producto_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return filterByEstado && filterByProducto;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.productoFiltered = this.productoCheckboxFilter.getFilteredList();
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.producto = this.productoFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(
      this.isFiltered ? JSON.stringify(filter) : '',
      !this.isFiltered
    );
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private getList(): void {
    this.ordenCargaService.getList().subscribe((list) => {
      this.list = list;
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.productoFilterList = getFilterList(
        list,
        (x) => x.flete_producto_descripcion
      );
      this.resetFilterList();
    });
  }

  private filter(
    filter: string,
    isFilteredByGlobalSearch: boolean = true
  ): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.estadoFiltered = this.estadoFilterList.slice();
    this.productoFiltered = this.productoFilterList.slice();
  }
}
