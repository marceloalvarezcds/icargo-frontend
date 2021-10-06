import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { saveAs } from 'file-saver';
import { CentroOperativo } from 'src/app/interfaces/centro-operativo';
import { Column } from 'src/app/interfaces/column';
import { CentroOperativoService } from 'src/app/services/centro-operativo.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  clasificacion?: string;
  ciudad?: string;
  pais?: string;
}

@Component({
  selector: 'app-centros-operativos-list',
  templateUrl: './centros-operativos-list.component.html',
  styleUrls: ['./centros-operativos-list.component.scss']
})
export class CentrosOperativosListComponent implements OnInit {

  columns: Column[] = [
    { def: 'nombre', title: 'Nombre', value: (element: CentroOperativo) => element.nombre, sticky: true },
    { def: 'nombre_corto', title: 'Nombre Corto', value: (element: CentroOperativo) => element.nombre_corto },
    { def: 'direccion', title: 'Dirección', value: (element: CentroOperativo) => element.direccion },
    { def: 'ubicacion', title: 'Ubicación', value: (element: CentroOperativo) => `${element.ciudad.nombre}/${element.ciudad.localidad.nombre}/${element.ciudad.localidad.pais.nombre_corto}` },
    { def: 'categoria', title: 'Clasificación', value: (element: CentroOperativo) => element.clasificacion.nombre },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: CentroOperativo[] = [];
  clasificacionFilterList: string[] = [];
  clasificacionFiltered: string[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];

  get isFilteredByClasificacion(): boolean {
    return this.clasificacionFiltered.length !== this.clasificacionFilterList.length
  }

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('clasificacionCheckboxFilter') clasificacionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('ciudadCheckboxFilter') ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private centroOperativoService: CentroOperativoService,
    private reportsService: ReportsService,
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.centroOperativoService.getList().subscribe(list => {
      this.list = list;
      this.clasificacionFilterList = getFilterList(list, (x) => x.clasificacion.nombre);
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad.nombre);
      this.paisFilterList = getFilterList(list, (x) => x.ciudad.localidad.pais.nombre);
      this.resetFilterList();
    });
  }

  downloadFile(): void {
    this.centroOperativoService.generateReports().subscribe(filename => {
      this.reportsService.downloadFile(filename).subscribe(file => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: CentroOperativo, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByClasificacion = filter.clasificacion?.split('|').some(x => obj.clasificacion.nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByCiudad = filter.ciudad?.split('|').some(x => obj.ciudad.nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais = filter.pais?.split('|').some(x => obj.ciudad.localidad.pais.nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByClasificacion && filterByCiudad && filterByPais;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.clasificacionFiltered = this.clasificacionCheckboxFilter.getFilteredList();
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    if (this.isFilteredByClasificacion) {
      filter.clasificacion = this.clasificacionFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    this.filter(this.isFiltered ? JSON.stringify(filter) : '', !this.isFiltered);
  }

  resetFilter(): void {
    this.resetFilterList();
    this.filter('');
  }

  private filter(filter: string, isFilteredByGlobalSearch: boolean = true): void {
    this.searchService.search(filter, isFilteredByGlobalSearch);
    this.accordion.closeAll();
  }

  private resetFilterList(): void {
    this.isFiltered = false;
    this.clasificacionFiltered = this.clasificacionFilterList.slice();
    this.ciudadFiltered = this.ciudadFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
  }
}
