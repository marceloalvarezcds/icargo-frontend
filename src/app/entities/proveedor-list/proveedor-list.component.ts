import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { ProveedorList } from 'src/app/interfaces/proveedor';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  composicion_juridica?: string;
  pais?: string;
  tipo_documento?: string;
};

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.scss'],
})
export class ProveedorListComponent implements OnInit {
  modelo = m.PROVEEDOR;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: ProveedorList) => element.id,
   
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: ProveedorList) => element.estado.toUpperCase(),
   
    },
    {
      def: 'nombre',
      title: 'Proveedor',
      value: (element: ProveedorList) => element.nombre,
     
    },
    // {
    //   def: 'nombre_corto',
    //   title: 'Nombre de Fantasía',
    //   value: (element: ProveedorList) => element.nombre_corto,
    // },
    {
      def: 'tipo_documento',
      title: 'Tipo Doc',
      value: (element: ProveedorList) => element.tipo_documento_descripcion,
    },
    {
      def: 'numero_documento',
      title: 'Nº de Doc.',
      value: (element: ProveedorList) => element.numero_documento,
    },
    {
      def: 'composicion_juridica',
      title: 'Comp. Jurídica',
      value: (element: ProveedorList) => element.composicion_juridica_nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: ProveedorList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: ProveedorList) =>
        element.ciudad_nombre
          ? `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`
          : '',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: ProveedorList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  composicionJuridicaFilterList: string[] = [];
  composicionJuridicaFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoDocumentoFilterList: string[] = [];
  tipoDocumentoFiltered: string[] = [];

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length;
  }

  get isFilteredByComposicionJuridica(): boolean {
    return (
      this.composicionJuridicaFiltered.length !==
      this.composicionJuridicaFilterList.length
    );
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
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter')
  tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private proveedorService: ProveedorService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/entities/${m.PROVEEDOR}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<ProveedorList>): void {
    this.router.navigate([
      `/entities/${m.PROVEEDOR}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<ProveedorList>): void {
    this.router.navigate([`/entities/${m.PROVEEDOR}/${a.VER}`, event.row.id]);
  }

  deleteRow({ row }: TableEvent<ProveedorList>): void {
    const message = `¿Está seguro que desea eliminar el Proveedor ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.proveedorService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.proveedorService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: ProveedorList, filterJson: string): boolean {
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
    this.proveedorService.getList().subscribe((list) => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.composicionJuridicaFilterList = getFilterList(
        list,
        (x) => x.composicion_juridica_nombre
      );
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
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoDocumentoFiltered = this.tipoDocumentoFilterList.slice();
  }
}
