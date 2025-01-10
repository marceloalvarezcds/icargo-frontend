import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { saveAs } from 'file-saver';
import { InsumoPuntoVentaPrecio, InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Router } from '@angular/router';

type Filter = {
  estado?: string;
  descripcion?: string;
  punto_venta?: string;
};

@Component({
  selector: 'app-insumo-list',
  templateUrl: './insumo-list.component.html',
  styleUrls: ['./insumo-list.component.scss']
})
export class InsumoListComponent implements OnInit {
  modelo = m.INSUMO_PUNTO_VENTA_PRECIO
  item?: InsumoPuntoVentaPrecioList;
  EstadoEnum = EstadoEnum;

  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: InsumoPuntoVentaPrecioList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: InsumoPuntoVentaPrecioList) => element.estado,
    },
    {
      def: 'fecha_inicio',
      title: 'Fecha',
      value: (element: InsumoPuntoVentaPrecioList) => this.formatDate(element.created_at_insumo),
    },
  
    {
      def: 'fecha_fin',
      title: 'Vigencia',
      value: (element: InsumoPuntoVentaPrecioList) => this.formatDate(element.fecha_inicio),
    },
    {
      def: 'descripcion',
      title: 'Descripcion',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_descripcion,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: InsumoPuntoVentaPrecioList) => element.marca_insumo,
    },
    {
      def: 'unidad',
      title: 'Unidad',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_unidad_descripcion,
    },
    {
      def: 'precio',
      title: 'Precio',
      value: (element: InsumoPuntoVentaPrecioList) => element.precio,
      type: 'number',
    },
    {
      def: 'moneda',
      title: 'Moneda',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_moneda_nombre,
    },
    {
      def: 'proveedor',
      title: 'Proveedor',
      value: (element: InsumoPuntoVentaPrecioList) => element.proveedor_nombre,
    },
    {
      def: 'proveedor_documento',
      title: 'RUC',
      value: (element: InsumoPuntoVentaPrecioList) => element.proveedor_documento,
    },
    {
      def: 'pdv',
      title: 'Punto de Venta',
      value: (element: InsumoPuntoVentaPrecioList) => element.punto_venta_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: InsumoPuntoVentaPrecioList) => element.created_by,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ]
  
  isFiltered = false;
  list: InsumoPuntoVentaPrecio[] = [];
  showInactiveOnly: boolean = false; 
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  descripcionFilterList: string[] = [];
  descripcionFiltered: string[] = [];
  puntoVentaFilterList: string[] = [];
  puntoVentaFiltered: string[] = [];
  filteredList: InsumoPuntoVentaPrecio[] = [];

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

  get isFilteredByDescripcion(): boolean {
    return this.descripcionFiltered.length !== this.descripcionFilterList.length;
  }

  get isFilteredByPuntoVenta(): boolean {
    return this.puntoVentaFiltered.length !== this.puntoVentaFilterList.length;
  }

  get isInactive(): boolean {
    return this.list.some(item => item.estado === EstadoEnum.INACTIVO);
  }


  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('descripcionCheckboxFilter')
  descripcionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('puntoVentaCheckboxFilter')
  puntoVentaCheckboxFilter!: CheckboxFilterComponent;

  constructor(  
    private insumoPuntoVentaService: InsumoPuntoVentaPrecioService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getList();
  }


  redirectToCreate(): void {
    this.router.navigate([`/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<InsumoPuntoVentaPrecio>): void {
    this.router.navigate([
      `/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<InsumoPuntoVentaPrecio>): void {
    this.router.navigate([
      `/insumo_punto_venta_precio/${m.INSUMO_PUNTO_VENTA_PRECIO}/${a.VER}`,
      event.row.id,
    ]);
  }

  downloadFile(): void {
    this.insumoPuntoVentaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterInactive(isChecked: boolean): void {
    if (isChecked) {
      // Si se seleccionan inactivos, llama al servicio para obtener solo los inactivos
      this.insumoPuntoVentaService.getInactiveList().subscribe((inactiveList) => {
        this.list = inactiveList; // Reemplaza la lista actual con solo los inactivos
        this.updateFilters(inactiveList); // Actualiza los filtros basados en los inactivos
      });
    } else {
      // Si no se seleccionan inactivos, recarga la lista original de activos
      this.getList();
    }
  }
  
  
  private updateFilters(list: any[]): void {
    this.estadoFilterList = getFilterList(list, (x) => x.estado);
    this.descripcionFilterList = getFilterList(list, (x) => x.insumo_descripcion);
    this.puntoVentaFilterList = getFilterList(list, (x) => x.punto_venta_nombre);
    this.resetFilterList();
  }
  
  
  filterPredicate(obj: InsumoPuntoVentaPrecioList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByDescripcion =
      filter.descripcion
        ?.split('|')
        .some(
          (x) => obj.insumo_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    const filterByPuntoVenta =
        filter.punto_venta
          ?.split('|')
          .some(
            (x) => obj.punto_venta_nombre.toLowerCase().indexOf(x) >= 0
          ) ?? true;
    return filterByEstado && filterByDescripcion && filterByPuntoVenta;
  }


  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.descripcionFiltered = this.descripcionCheckboxFilter.getFilteredList();
    this.puntoVentaFiltered = this.puntoVentaCheckboxFilter.getFilteredList();
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByDescripcion) {
      filter.descripcion = this.descripcionFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPuntoVenta) {
      filter.punto_venta = this.puntoVentaFiltered.join('|');
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
    this.insumoPuntoVentaService.getList().subscribe((list) => {
      this.list = list;
      this.updateFilters(list);
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.descripcionFilterList = getFilterList(
        list,
        (x) => x.insumo_descripcion
      );
      this.puntoVentaFilterList = getFilterList(
        list,
        (x) => x.punto_venta_nombre
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
    this.descripcionFiltered = this.descripcionFilterList.slice();
    this.puntoVentaFiltered = this.puntoVentaFilterList.slice();
  }
}
