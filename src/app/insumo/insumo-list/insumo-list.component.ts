import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Insumo } from 'src/app/interfaces/insumo';
import { InsumoPuntoVenta } from 'src/app/interfaces/insumo-punto-venta';
import { InsumoPuntoVentaPrecio, InsumoPuntoVentaPrecioList } from 'src/app/interfaces/insumo-punto-venta-precio';
import { DialogService } from 'src/app/services/dialog.service';
import { InsumoPuntoVentaPrecioService } from 'src/app/services/insumo-punto-venta-precio.service';
import { InsumoService } from 'src/app/services/insumo.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  estado?: string;
  descripcion?: string;
};

@Component({
  selector: 'app-insumo-list',
  templateUrl: './insumo-list.component.html',
  styleUrls: ['./insumo-list.component.scss']
})
export class InsumoListComponent implements OnInit {
  modelo = m.INSUMO_PUNTO_VENTA_PRECIO
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: InsumoPuntoVentaPrecioList) => element.id,
    },
    {
      def: 'precio',
      title: 'Precio',
      value: (element: InsumoPuntoVentaPrecioList) => element.precio,
    },
    {
      def: 'tipo',
      title: 'Descripcion',
      value: (element: InsumoPuntoVentaPrecioList) => element.insumo_descripcion,
    },
    {
      def: 'pdv',
      title: 'PDV',
      value: (element: InsumoPuntoVentaPrecioList) => element.punto_venta_nombre,
    },
  
  ]
  
  isFiltered = false;
  list: InsumoPuntoVentaPrecioList[] = [];
  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];
  descripcionFilterList: string[] = [];
  descripcionFiltered: string[] = [];

  get isFilteredByEstado(): boolean {
    return this.estadoFiltered.length !== this.estadoFilterList.length;
  }

  get isFilteredByDescripcion(): boolean {
    return this.descripcionFiltered.length !== this.descripcionFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('descripcionCheckboxFilter')
  descripcionCheckboxFilter!: CheckboxFilterComponent;

  ngOnInit(): void {
    this.getList();
  }

  constructor(  
    private insumoPuntoVentaService: InsumoPuntoVentaPrecioService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
  ) {}

  filterPredicate(obj: Insumo, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByEstado =
      filter.estado
        ?.split('|')
        .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByDescripcion =
      filter.descripcion
        ?.split('|')
        .some(
          (x) => obj.descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return filterByEstado && filterByDescripcion;
  }


  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();
    this.descripcionFiltered = this.descripcionCheckboxFilter.getFilteredList();
    if (this.isFilteredByEstado) {
      filter.estado = this.estadoFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByDescripcion) {
      filter.descripcion = this.descripcionFiltered.join('|');
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
      this.estadoFilterList = getFilterList(list, (x) => x.estado);
      this.descripcionFilterList = getFilterList(
        list,
        (x) => x.insumo_descripcion
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
  }
}
