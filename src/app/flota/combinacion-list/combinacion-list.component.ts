import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { CombinacionList } from 'src/app/interfaces/combinacion';
import { TableEvent } from 'src/app/interfaces/table';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  camion?: string;
  semi?: string;
  chofer?: string;
  marca?: string;
  propietario?: string;
};
@Component({
  selector: 'app-combinacion-list',
  templateUrl: './combinacion-list.component.html',
  styleUrls: ['./combinacion-list.component.scss']
})
export class CombinacionListComponent implements OnInit{
  modelo = m.COMBINACION;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: CombinacionList) => element.id,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CombinacionList) => element.estado.toUpperCase(),
    },
    {
       def: 'camion',
       title: 'Tracto',
       value: (element: CombinacionList) => element.camion_placa,
     },
     {
       def: 'marca_camion',
       title: 'Marca',
       value: (element: CombinacionList) => element.marca_descripcion,
     },
    {
      def: 'camion_semi_neto',
      title: 'Neto',
      value: (element: CombinacionList) => element.neto,
      type: 'number',
    },
    {
      def: 'semi',
      title: 'Semi',
      value: (element: CombinacionList) => element.semi_placa,
    },
    {
      def: 'marca_semi',
      title: 'Marca',
      value: (element: CombinacionList) => element.marca_descripcion_semi,
    },
    {
      def: 'chofer',
      title: 'Chofer',
      value: (element: CombinacionList) => element.chofer_nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: CombinacionList) => element.camion_propietario_nombre,
    },
    {
      def: 'beneficiario',
      title: 'Beneficiario',
      value: (element: CombinacionList) => element.propietario_nombre,
    },
     {
      def: 'usuario',
      title: 'Usuario',
      value: (element: CombinacionList) => element.modified_by,
     },
    {
      def: 'modified_at',
      title: 'Fecha',
      value: (element: CombinacionList) => this.formatDate(element.modified_at),
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: CombinacionList[] = [];
  camionFilterList: string[] = [];
  camionFiltered: string[] = [];
  marcaFilterList: string[] = [];
  marcaFiltered: string[] = [];
  propietarioFilterList: string[] = [];
  propietarioFiltered: string[] = [];
  choferFilterList: string[] = [];
  choferFiltered: string[] = [];
  semiFilterList: string[] = [];
  semiFiltered: string[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  get isFilteredByMarca(): boolean {
    return this.marcaFiltered.length !== this.marcaFilterList.length;
  }

  get isFilteredByPropietario(): boolean {
    return (
      this.propietarioFiltered.length !== this.propietarioFilterList.length
    );
  }

  get isFilteredByCamion(): boolean {
    return this.camionFiltered.length !== this.camionFilterList.length;
  }

  get isFilteredBySemi(): boolean {
    return this.semiFiltered.length !== this.semiFilterList.length;
  }

  get isFilteredByChofer(): boolean {
    return this.choferFiltered.length !== this.choferFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('marcaCheckboxFilter')
  marcaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('propietarioCheckboxFilter')
  propietarioCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('camionCheckboxFilter')
  camionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('semiCheckboxFilter')
  semiCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('choferCheckboxFilter')
  choferCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private combinacionService: CombinacionService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.COMBINACION}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<CombinacionList>): void {
    this.router.navigate([
      `/flota/${m.COMBINACION}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<CombinacionList>): void {
    this.router.navigate([
      `/flota/${m.COMBINACION}/${a.VER}`,
      event.row.id,
    ]);
  }

  downloadFile(): void {
    this.combinacionService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: CombinacionList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterBycamion =
    filter.camion
      ?.split('|')
      .some((x) => obj.camion_placa.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByMarca =
    filter.marca
      ?.split('|')
      .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPropietario =
    filter.propietario
      ?.split('|')
      .some((x) => obj.propietario.nombre.toLowerCase().indexOf(x) >= 0) ?? true;
      const filterBySemi =
      filter.semi
        ?.split('|')
        .some((x) => obj.semi.placa.toLowerCase().indexOf(x) >= 0) ??
      true;
      const filterByChofer =
      filter.chofer
        ?.split('|')
        .some((x) => obj.chofer.nombre.toLowerCase().indexOf(x) >= 0) ??
      true;
    return filterByPropietario && filterByMarca && filterBycamion && filterBySemi && filterByChofer;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.propietarioFiltered = this.propietarioCheckboxFilter.getFilteredList();
    this.marcaFiltered = this.marcaCheckboxFilter.getFilteredList();
    this.camionFiltered = this.camionCheckboxFilter.getFilteredList();
    this.semiFiltered = this.semiCheckboxFilter.getFilteredList();
    this.choferFiltered = this.choferCheckboxFilter.getFilteredList();
    if (this.isFilteredByCamion) {
      filter.camion = this.camionFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByMarca) {
      filter.marca = this.marcaFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPropietario) {
      filter.propietario = this.propietarioFiltered.join('|');
      this.isFiltered = true;
    }

    if (this.isFilteredBySemi) {
      filter.semi = this.semiFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByChofer) {
      filter.chofer = this.choferFiltered.join('|');
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
    this.combinacionService.getList().subscribe((list) => {
      this.list = list;
      this.camionFilterList = getFilterList(list,(x) => x.camion_placa);
      this.marcaFilterList = getFilterList(list,(x) => x.marca_descripcion);
      this.propietarioFilterList = getFilterList(list,(x) => x.propietario.nombre);
      this.semiFilterList = getFilterList(list,(x) => x.semi.placa);
      this.choferFilterList = getFilterList(list,(x) => x.chofer.nombre);
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
    this.propietarioFiltered = this.propietarioFilterList.slice();
    this.marcaFiltered = this.marcaFilterList.slice();
    this.camionFiltered = this.camionFilterList.slice();
    this.semiFiltered = this.semiFilterList.slice();
    this.choferFiltered = this.choferFilterList.slice();
  }
}

