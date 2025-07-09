import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { RemisionFormDialogComponent } from 'src/app/dialogs/remision-form-dialog/remision-form-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { Column } from 'src/app/interfaces/column';
import { OrdenCarga, OrdenCargaList } from 'src/app/interfaces/orden-carga';
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
      title: 'ID',
      value: (element: OrdenCargaList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: OrdenCargaList) => element.estado.toUpperCase(),
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: OrdenCargaList) => this.formatDate(element.created_at),
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
    {
      def: 'camion_chofer_nombre',
      title: 'Chofer',
      value: (element: OrdenCargaList) => element.chofer_nombre,
    },
    {
      def: 'camion_chofer_documento',
      title: 'Nº de Doc.',
      value: (element: OrdenCargaList) => element.combinacion_chofer_doc,
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
      def: 'a_pagar_flete',
      title: 'A Pagar',
      value: (element: OrdenCargaList) =>
        `${element.condicion_propietario_tarifa?.toLocaleString('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })} ${element.flete_tarifa_unidad_propietario?.toUpperCase()}`,
      type: 'text',
    },
    {
      def: 'resultado_propietario_total_anticipos_retirados_ml',
      title: 'Anticipos Ret. ML',
      value: (element: OrdenCargaList) => element.resultado_propietario_total_anticipos_retirados_ml,
      type: 'number',
    },
    {
      def: 'cantidad_nominada_oc',
      title: 'Cant. Nominada',
      value: (element: OrdenCargaList) => element.cantidad_nominada,
      type: 'number',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: OrdenCargaList) => element.created_by,
    },

    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  buttons : ButtonList[] = [
    {
      color: 'warn',
      tooltip: 'REMISIÓN',
      styles: '',
      icon: 'check_box',
      label: 'REMISION',
      iconClass: 'check_box',
      buttonCallback: ($event:any) => {
        this.createRemision();
      }
    },
  ]

  isFiltered = false;
  list: OrdenCargaList[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  productoFilterList: string[] = [];
  productoFiltered: string[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  get isFilteredByEstado(): boolean {
    return this.estadoFiltered.length !== this.estadoFilterList.length;
  }

  get isFilteredByProducto(): boolean {
    return this.productoFiltered.length !== this.productoFilterList.length;
  }

  get hideEdit(): boolean {
    return this.list.some(item => item.estado === EstadoEnum.CANCELADO);
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

  // redirectToCreate(): void {
  //   const url = `/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}`;
  //   window.open(url, '_blank');
  // }

  redirectToCreateAnticipo(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}/nuevo/anticipo`]);
  }


  redirectToCreateRecepcion(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}/recepecion`]);
  }


  redirectToAceptar(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}/aceptar/oc/nuevas`]);
  }


  redirectToFinalizar(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}/nuevo/finalizar/ocs/aceptadas`]);
  }

  redirectToConciliar(): void {
    this.router.navigate([`/orden-carga/${m.ORDEN_CARGA}/${a.CREAR}/nuevo/conciliar/ocs/conciliacion/final`]);
  }

  // redirectToEdit(event: TableEvent<OrdenCargaList>): void {
  //   const url = `/orden-carga/${m.ORDEN_CARGA}/${a.EDITAR}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }


  // redirectToShow(event: TableEvent<OrdenCargaList>): void {
  //   const url = `/orden-carga/${m.ORDEN_CARGA}/${a.VER}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }

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

  createRemision(): void {

    this.dialog
      .open(RemisionFormDialogComponent,
        {
          panelClass: 'half-dialog',
        })
      .afterClosed()
      //.pipe(filter((confirmed) => !!confirmed))
      .subscribe(() => {
      });

  }

}
