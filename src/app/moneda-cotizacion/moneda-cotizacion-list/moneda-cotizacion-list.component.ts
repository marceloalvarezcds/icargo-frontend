import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { MonedaCotizacion } from 'src/app/interfaces/moneda_cotizacion';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { MonedaCotizacionService } from 'src/app/services/moneda-cotizacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';
type Filter = {
  gestor_carga_nombre?: string;
};

@Component({
  selector: 'app-moneda-cotizacion-list',
  templateUrl: './moneda-cotizacion-list.component.html',
  styleUrls: ['./moneda-cotizacion-list.component.scss']
})
export class MonedaCotizacionListComponent implements OnInit {
  modelo = m.MONEDA_COTIZACION
  item?: MonedaCotizacion;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: MonedaCotizacion) => element.id,
    },
    {
      def: 'gestor_carga_nombre',
      title: 'Gestor Carga',
      value: (element: MonedaCotizacion) => element.gestor_carga_nombre,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: MonedaCotizacion) => element.estado,
    },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: MonedaCotizacion) => element.fecha,
    },
    {
      def: 'moneda_origen_nombre',
      title: 'Moneda Origen',
      value: (element: MonedaCotizacion) => element.moneda_origen_nombre,
    },
    {
      def: 'moneda_destino_nombre',
      title: 'Moneda Destino',
      value: (element: MonedaCotizacion) => element.moneda_destino_nombre,
    },
    {
      def: 'cotizacion_moneda',
      title: 'Cotizacion',
      value: (element: MonedaCotizacion) => element.cotizacion_moneda,
    },

    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ]

   isFiltered = false;
   list: MonedaCotizacion[] = [];
   gestorFilterList: string[] = [];
   gestorFiltered: string[] = [];

   get isFilteredByGestor(): boolean {
    return this.gestorFiltered.length !== this.gestorFilterList.length;
  }
    @ViewChild(MatAccordion) accordion!: MatAccordion;
    @ViewChild('estadoCheckboxFilter')
    gestorCheckboxFilter!: CheckboxFilterComponent;
  constructor(
      private monedaCotizacionService: MonedaCotizacionService,
      private reportsService: ReportsService,
      private searchService: SearchService,
      private dialog: DialogService,
      private router: Router,) { }

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/moneda_cotizacion/${m.MONEDA_COTIZACION}/${a.CREAR}`]);
  }

  redirectToShow(event: TableEvent<MonedaCotizacion>): void {
      this.router.navigate([
        `/moneda_cotizacion/${m.MONEDA_COTIZACION}/${a.VER}`,
        event.row.id,
      ]);
    }

  filterPredicate(obj: MonedaCotizacion, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByGestor =
      filter.gestor_carga_nombre
      ?.split('|')
      .some((x) => obj.gestor_carga_nombre ? obj.gestor_carga_nombre.toLowerCase().indexOf(x) >= 0 : false) ?? true;
      // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
    true;

    return filterByGestor;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.gestorFiltered = this.gestorCheckboxFilter.getFilteredList();

    if (this.isFilteredByGestor) {
      filter.gestor_carga_nombre = this.gestorFiltered.join('|');
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
    this.monedaCotizacionService.getListByGestorCarga().subscribe((list) => {
      this.list = list;
      this.gestorFilterList = getFilterList(list, (x) => x.gestor_carga_nombre);

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
    this.gestorFiltered = this.gestorFilterList.slice();

  }
}
