import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { GestorCargaList } from 'src/app/interfaces/gestor-carga';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { GestorCargaService } from 'src/app/services/gestor-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  composicion_juridica?: string;
  moneda?: string;
  pais?: string;
  tipo_documento?: string;
};

@Component({
  selector: 'app-gestor-carga-list',
  templateUrl: './gestor-carga-list.component.html',
  styleUrls: ['./gestor-carga-list.component.scss'],
})
export class GestorCargaListComponent implements OnInit {
  modelo = m.GESTOR_CARGA;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: GestorCargaList) => element.id,
  
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: GestorCargaList) => element.estado.toUpperCase(),

    },
    {
      def: 'nombre',
      title: 'Gestora de Carga',
      value: (element: GestorCargaList) => element.nombre,
   
    },
    {
      def: 'numero_documento',
      title: 'Nº de Doc.',
      value: (element: GestorCargaList) => element.numero_documento,
    },
    {
      def: 'tipo_documento',
      title: 'Tipo Doc.',
      value: (element: GestorCargaList) => element.tipo_documento_descripcion,
    },

    {
      def: 'composicion_juridica',
      title: 'Comp. Jurídica',
      value: (element: GestorCargaList) => element.composicion_juridica_nombre,
    },
    {
      def: 'gestor_elemento',
      title: 'G.E.',
    },
    {
      def: 'created_by',
      title: 'Admin',
      // value: (element: GestorCargaList) => element.created_by,
    },
    {
      def: 'telefono',
      title: 'Celular Admin',
      // value: (element: GestorCargaList) => element.telefono,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: GestorCargaList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  composicionJuridicaFilterList: string[] = [];
  composicionJuridicaFiltered: string[] = [];
  monedaFilterList: string[] = [];
  monedaFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoDocumentoFilterList: string[] = [];
  tipoDocumentoFiltered: string[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length;
  }

  get isFilteredByComposicionJuridica(): boolean {
    return (
      this.composicionJuridicaFiltered.length !==
      this.composicionJuridicaFilterList.length
    );
  }

  get isFilteredByMoneda(): boolean {
    return this.monedaFiltered.length !== this.monedaFilterList.length;
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length;
  }

  get isFilteredByTipoDocumento(): boolean {
    return (
      this.tipoDocumentoFiltered.length !== this.tipoDocumentoFilterList.length
    );
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter')
  ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('composicionJuridicaCheckboxFilter')
  composicionJuridicaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('monedaCheckboxFilter')
  monedaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter')
  tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private gestorCargaService: GestorCargaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/entities/${m.GESTOR_CARGA}/${a.CREAR}`]);
  }
  
  redirectToEdit(event: TableEvent<GestorCargaList>): void {
    this.router.navigate([
      `/entities/${m.GESTOR_CARGA}/${a.EDITAR}`,
      event.row.id,
    ]);
  }
  
  redirectToShow(event: TableEvent<GestorCargaList>): void {
    this.router.navigate([
      `/entities/${m.GESTOR_CARGA}/${a.VER}`,
      event.row.id,
    ]);
  }

  deleteRow({ row }: TableEvent<GestorCargaList>): void {
    const message = `¿Está seguro que desea eliminar el Gestor ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.gestorCargaService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.gestorCargaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: GestorCargaList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByComposicionJuridica =
      filter.composicion_juridica
        ?.split('|')
        .some((x) =>
          obj.composicion_juridica_nombre
            ? obj.composicion_juridica_nombre.toLowerCase().indexOf(x) >= 0
            : false
        ) ?? true;
    const filterByCiudad =
      filter.ciudad
        ?.split('|')
        .some((x) =>
          obj.ciudad_nombre
            ? obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0
            : false
        ) ?? true;
    const filterByMoneda =
      filter.moneda
        ?.split('|')
        .some((x) => obj.moneda_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais =
      filter.pais
        ?.split('|')
        .some((x) =>
          obj.pais_nombre
            ? obj.pais_nombre.toLowerCase().indexOf(x) >= 0
            : false
        ) ?? true;
    const filterByTipoDocumento =
      filter.tipo_documento
        ?.split('|')
        .some(
          (x) => obj.tipo_documento_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return (
      filterByComposicionJuridica &&
      filterByCiudad &&
      filterByMoneda &&
      filterByPais &&
      filterByTipoDocumento
    );
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.composicionJuridicaFiltered =
      this.composicionJuridicaCheckboxFilter.getFilteredList();
    this.monedaFiltered = this.monedaCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoDocumentoFiltered =
      this.tipoDocumentoCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByComposicionJuridica) {
      filter.composicion_juridica = this.composicionJuridicaFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByMoneda) {
      filter.moneda = this.monedaFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipoDocumento) {
      filter.tipo_documento = this.tipoDocumentoFiltered.join('|');
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
    this.gestorCargaService.getList().subscribe((list) => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.composicionJuridicaFilterList = getFilterList(
        list,
        (x) => x.composicion_juridica_nombre
      );
      this.monedaFilterList = getFilterList(list, (x) => x.moneda_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      this.tipoDocumentoFilterList = getFilterList(
        list,
        (x) => x.tipo_documento_descripcion
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
    this.ciudadFiltered = this.ciudadFilterList.slice();
    this.composicionJuridicaFiltered =
      this.composicionJuridicaFilterList.slice();
    this.monedaFiltered = this.monedaFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoDocumentoFiltered = this.tipoDocumentoFilterList.slice();
  }
}
