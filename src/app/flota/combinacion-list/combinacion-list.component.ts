import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { Combinacion } from 'src/app/interfaces/combinacion';
import { CombinacionService } from 'src/app/services/combinacion.service';
import { DialogService } from 'src/app/services/dialog.service';
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
  module: string = "Nombre del Módulo";
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: Combinacion) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: Combinacion) => element.estado,
    },
    {
      def: 'camion',
      title: 'Tracto',
      value: (element: Combinacion) => element.camion.placa,
    },
    {
      def: 'marca_camion',
      title: 'Marca',
      value: (element: Combinacion) => element.camion.marca.descripcion,
    },
    {
      def: 'semi',
      title: 'Semi',
      value: (element: Combinacion) => element.semi.placa,
    },
    {
      def: 'marca_semi',
      title: 'Marca',
      value: (element: Combinacion) => element.semi.marca.descripcion,
    },
    {
      def: 'chofer',
      title: 'Chofer',
      value: (element: Combinacion) => element.chofer.nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: Combinacion) => element.propietario.nombre,
    },
     {
         def: 'usuario',
        title: 'Usuario',
         value: (element: Combinacion) => element.created_by,
     },
    {
      def: 'modified_at',
      title: 'Fecha',
      value: (element: Combinacion) => element.modified_at,
      type: 'date',
    },
    // Otros campos y columnas...
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: Combinacion[] = [];
  marcaFilterList: string[] = [];
  marcaFiltered: string[] = [];
  propietarioFilterList: string[] = [];
  propietarioFiltered: string[] = [];
  camionFilterList: string[] = [];
  camionFiltered: string[] = [];
  choferFilterList: string[] = [];
  choferFiltered: string[] = [];
  semiFilterList: string[] = [];
  semiFiltered: string[] = [];

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
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('propietarioCheckboxFilter')
  propietarioCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('camionCheckboxFilter') camionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('semiCheckboxFilter') semiCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('choferCheckboxFilter') choferCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private combinacionService: CombinacionService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.COMBINACION}/${a.CREAR}`]);
  }


  downloadFile(): void {
    this.combinacionService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: Combinacion, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByPropietario =
    filter.propietario
      ?.split('|')
      .some((x) => obj.propietario.nombre.toLowerCase().indexOf(x) >= 0) ??
    true;
    const filterByMarca =
      filter.marca
        ?.split('|')
        .some((x) => obj.camion.marca.descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
      const filterBycamion =
      filter.camion
        ?.split('|')
        .some((x) => obj.camion.placa.toLowerCase().indexOf(x) >= 0) ??
      true;
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
    if (this.isFilteredByPropietario) {
      filter.propietario = this.propietarioFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByMarca) {
      filter.marca = this.marcaFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByCamion) {
      filter.camion = this.camionFiltered.join('|');
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
      this.propietarioFilterList = getFilterList(list,(x) => x.propietario.nombre);
      this.marcaFilterList = getFilterList(list,(x) => x.camion.marca.descripcion);
      this.camionFilterList = getFilterList(list,(x) => x.camion.placa);
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

