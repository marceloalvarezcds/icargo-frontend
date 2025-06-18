import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FleteCantidadCondicionesDialogComponent } from 'src/app/dialogs/flete-cantidad-condiciones-dialog/flete-cantidad-condiciones-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Flete, FleteList } from 'src/app/interfaces/flete';
import { SeleccionableBaseModel } from 'src/app/interfaces/seleccionable';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { FleteService } from 'src/app/services/flete.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { SeleccionableListService } from 'src/app/shared/seleccionable-list/seleccionable-list.service';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  publicado?: string;
  estado?: string;
  producto?: string;
};

@Component({
  selector: 'app-flete-list',
  templateUrl: './flete-list.component.html',
  styleUrls: ['./flete-list.component.scss'],
})
export class FleteListComponent implements OnInit {
  modelo = m.FLETE;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: FleteList) => element.id,

    },
    {
      def: 'numero_lote',
      title: 'Nº Lote',
      value: (element: FleteList) => element.numero_lote,

    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: FleteList) => element.estado.toUpperCase(),

    },
    {
      def: 'remitente_nombre',
      title: 'Cliente',
      value: (element: FleteList) => element.remitente_nombre,
    },
    {
      def: 'producto_descripcion',
      title: 'Producto',
      value: (element: FleteList) => element.producto_descripcion,
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
    // {
    //   def: 'a_cobrar_flete',
    //   title: 'A Cobrar',
    //   value: (element: FleteList) => element.condicion_gestor_carga_tarifa,
    //   type: 'number',
    // },
    {
      def: 'a_pagar_flete',
      title: 'A Pagar',
      value: (element: FleteList) =>
        `${element.condicion_propietario_tarifa?.toLocaleString('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })} ${element.condicion_propietario_moneda_simbolo}/${element.condicion_propietario_unidad_abreviatura}`,
      type: 'text',
    },
    {
      def: 'a_cobrar_flete',
      title: 'A Cobrar',
      value: (element: FleteList) =>
        `${element.condicion_gestor_carga_tarifa?.toLocaleString('es-ES', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })} ${element.condicion_gestor_carga_moneda_simbolo}/${element.condicion_gestor_carga_unidad_abreviatura}`,
      type: 'text',
    },

    {
      def: 'cantidad_flete',
      title: 'Cantidad',
      value: (element: FleteList) => element.condicion_cantidad,
      type: 'number',
    },
    {
      def: 'tipo_carga_descripcion',
      title: 'UM',
      value: (element: FleteList) => element.merma_gestor_carga_unidad_descripcion,
    },

    {
      def: 'cargado_flete',
      title: 'Cargado',
      value: (element: FleteList) => element.cargado,
      type: 'number',
    },
    {
      def: 'saldo_flete',
      title: 'Saldo',
      value: (element: FleteList) => element.saldo,
      type: 'number',
    },
    // {
    //   def: 'tipo_carga_descripcion',
    //   title: 'Tipo de Carga',
    //   value: (element: FleteList) => element.tipo_carga_descripcion,
    // },

    {
      def: 'publicado_descripcion',
      title: 'Publicar',
      value: (element: FleteList) => element.publicado_descripcion,
    },
    // {
    //   def: 'es_subasta',
    //   title: 'Tipo de Pedido',
    //   value: (element: FleteList) => (element.es_subasta ? 'Subasta' : 'Flete'),
    // },
    // {
    //   def: 'gestor_carga_nombre',
    //   title: 'Gestor de Carga',
    //   value: (element: FleteList) => element.gestor_carga_nombre,
    // },
    {
      def: 'origen_indicacion',
      title: 'Tramo',
      value: (element: FleteList) => element.origen_indicacion,
    },

    // {
    //   def: 'destino_indicacion',
    //   title: 'Destino Indicaciones',
    //   value: (element: FleteList) => element.destino_indicacion,
    // },
    // {
    //   def: 'distancia',
    //   title: 'Distancia',
    //   value: (element: FleteList) => element.distancia,
    //   type: 'number',
    // },
    // {
    //   def: 'tipo_flete',
    //   title: 'Tipo de Flete',
    //   value: (element: FleteList) => element.tipo_flete,
    // },

    // {
    //   def: 'condicion_gestor_carga_moneda_nombre',
    //   title: 'Condición para Gestor - Moneda',
    //   value: (element: FleteList) =>
    //     element.condicion_gestor_carga_moneda_nombre,
    // },

    // {
    //   def: 'condicion_gestor_carga_unidad_descripcion',
    //   title: 'Condición para Gestor - Unidad',
    //   value: (element: FleteList) =>
    //     element.condicion_gestor_carga_unidad_descripcion,
    // },
    // {
    //   def: 'condicion_propietario_moneda_nombre',
    //   title: 'Condición para Propietario - Moneda',
    //   value: (element: FleteList) =>
    //     element.condicion_propietario_moneda_nombre,
    // },

    // {
    //   def: 'condicion_propietario_unidad_descripcion',
    //   title: 'Condición para Propietario - Unidad',
    //   value: (element: FleteList) =>
    //     element.condicion_propietario_unidad_descripcion,
    // },
    // {
    //   def: 'merma_gestor_carga_valor',
    //   title: 'Merma para Gestor - Valor',
    //   value: (element: FleteList) => element.merma_gestor_carga_valor,
    //   type: 'number',
    // },
    // {
    //   def: 'merma_gestor_carga_moneda_nombre',
    //   title: 'Merma para Gestor - Moneda',
    //   value: (element: FleteList) => element.merma_gestor_carga_moneda_nombre,
    // },
    // {
    //   def: 'merma_gestor_carga_unidad_descripcion',
    //   title: 'Merma para Gestor - Unidad',
    //   value: (element: FleteList) =>
    //     element.merma_gestor_carga_unidad_descripcion,
    // },
    // {
    //   def: 'merma_gestor_carga_es_porcentual',
    //   title: 'Merma para Gestor - Es Cálculo porcentual',
    //   value: (element: FleteList) =>
    //     element.merma_gestor_carga_es_porcentual_descripcion,
    // },
    // {
    //   def: 'merma_gestor_carga_tolerancia',
    //   title: 'Merma para Gestor - Tolerancia',
    //   value: (element: FleteList) => element.merma_gestor_carga_tolerancia,
    //   type: 'number',
    // },
    // {
    //   def: 'merma_propietario_valor',
    //   title: 'Merma para Propietario - Valor',
    //   value: (element: FleteList) => element.merma_propietario_valor,
    //   type: 'number',
    // },
    // {
    //   def: 'merma_propietario_moneda_nombre',
    //   title: 'Merma para Propietario - Moneda',
    //   value: (element: FleteList) => element.merma_propietario_moneda_nombre,
    // },
    // {
    //   def: 'merma_propietario_unidad_descripcion',
    //   title: 'Merma para Propietario - Unidad',
    //   value: (element: FleteList) =>
    //     element.merma_propietario_unidad_descripcion,
    // },
    // {
    //   def: 'merma_propietario_es_porcentual',
    //   title: 'Merma para Propietario - Es Cálculo porcentual',
    //   value: (element: FleteList) =>
    //     element.merma_propietario_es_porcentual_descripcion,
    // },
    // {
    //   def: 'merma_propietario_tolerancia',
    //   title: 'Merma para Propietario - Tolerancia',
    //   value: (element: FleteList) => element.merma_propietario_tolerancia,
    //   type: 'number',
    // },
    // {
    //   def: 'vigencia_anticipos',
    //   title: 'Vigencia de Anticipos',
    //   value: (element: FleteList) => element.vigencia_anticipos,
    // },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: FleteList) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: FleteList) => this.formatDate(element.created_at),
    },
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: FleteList) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: FleteList) => element.modified_at,
    //   type: 'date',
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: FleteList[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  productoFilterList: string[] = [];
  productoFiltered: string[] = [];
  publicadoFilterList: string[] = [];
  publicadoFiltered: string[] = [];
  flete?: Flete;

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

  get isFilteredByPublicado(): boolean {
    return this.publicadoFiltered.length !== this.publicadoFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('publicadoCheckboxFilter')
  publicadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('productoCheckboxFilter')
  productoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private fleteService: FleteService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.getList();
    this.fetchList();
  }

  fetchList(): void {
    this.fleteService.getListByGestorCarga().subscribe({
      next: (data) => {
        this.list = data;
      },
      error: (err) => {
        console.error('Error al obtener la lista de fletes', err);
      },
    });
  }

  redirectToCreate(): void {
    this.router.navigate([`/flete/${m.FLETE}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<FleteList>): void {
    this.router.navigate([`/flete/${m.FLETE}/${a.EDITAR}`, event.row.id]);
   }

  redirectToShow(event: TableEvent<FleteList>): void {
    this.router.navigate([`/flete/${m.FLETE}/${a.VER}`, event.row.id]);
   }

  redirectToAmpliar(event: TableEvent<FleteList>): void {
    const dialogRef = this.dialog.open(FleteCantidadCondicionesDialogComponent, {
      width: '600px',
      data: { flete: event.row }
    });

    dialogRef.afterClosed().subscribe((updatedCantidad) => {
      if (typeof updatedCantidad === 'number') {
        this.fleteService.updateCantidad(event.row.id, updatedCantidad).subscribe(() => {
          this.fetchList();
        });
      }
    });
  }

  fnHideEdit = (row: Flete): boolean => {
    return row?.is_in_orden_carga === false;
  };

  //  redirectToCreate(): void {
  //    const url = `/flete/${m.FLETE}/${a.CREAR}`;
  //    window.open(url, '_blank');
  //  }

  // redirectToEdit(event: TableEvent<FleteList>): void {
  //   const url = `/flete/${m.FLETE}/${a.EDITAR}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }

  // redirectToShow(event: TableEvent<FleteList>): void {
  //   const url = `/flete/${m.FLETE}/${a.VER}/${event.row.id}`;
  //   window.open(url, '_blank');
  // }

  deleteRow({ row }: TableEvent<FleteList>): void {
    const message = `¿Está seguro que desea eliminar el Flete con Nº ${row.id}?`;
    this.dialog.confirmationToDelete(
      message,
      this.fleteService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  active({ row }: TableEvent<FleteList>): void {
    const message = `¿Está seguro que desea activar el Pedido con Nº ${row.id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.fleteService.active(row.id),
      () => {
        this.getList();
      }
    );
  }

  inactive({ row }: TableEvent<FleteList>): void {
    const message = `¿Está seguro que desea inactivar el Pedido con Nº ${row.id}?`;
    this.dialog.changeStatusConfirm(
      message,
      this.fleteService.inactive(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.fleteService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: FleteList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByProducto =
      filter.producto
        ?.split('|')
        .some((x) => obj.producto_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
    const filterByPublicado =
      filter.publicado
        ?.split('|')
        .some((x) =>
          obj.publicado_descripcion
            ? obj.publicado_descripcion.toLowerCase().indexOf(x) >= 0
            : false
        ) ?? true;
    return filterByPublicado && filterByEstado && filterByProducto;
  }


  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.productoFiltered = this.productoCheckboxFilter.getFilteredList();
    this.publicadoFiltered = this.publicadoCheckboxFilter.getFilteredList();
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.producto = this.productoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPublicado) {
      filter.publicado = this.publicadoFiltered.join('|');
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
    this.fleteService.getListByGestorCarga().subscribe((list) => {
      this.list = list;
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.productoFilterList = getFilterList(
        list,
        (x) => x.producto_descripcion
      );
      this.publicadoFilterList = getFilterList(
        list,
        (x) => x.publicado_descripcion
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
    this.publicadoFiltered = this.publicadoFilterList.slice();
  }
}
