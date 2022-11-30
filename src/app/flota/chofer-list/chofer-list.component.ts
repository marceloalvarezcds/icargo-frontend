import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ChoferList } from 'src/app/interfaces/chofer';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { ChoferService } from 'src/app/services/chofer.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  pais?: string;
  tipo_documento?: string;
};

@Component({
  selector: 'app-chofer-list',
  templateUrl: './chofer-list.component.html',
  styleUrls: ['./chofer-list.component.scss'],
})
export class ChoferListComponent implements OnInit {
  modelo = m.CHOFER;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: ChoferList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: ChoferList) => element.estado,
    },
    {
      def: 'nombre',
      title: 'Nombre o Razón Social',
      value: (element: ChoferList) => element.nombre,
    },
    {
      def: 'tipo_documento',
      title: 'Tipo de Documento',
      value: (element: ChoferList) => element.tipo_documento_descripcion,
    },
    {
      def: 'pais_emisor_documento',
      title: 'País Emisor del Documento',
      value: (element: ChoferList) => element.pais_emisor_documento_nombre,
    },
    {
      def: 'numero_documento',
      title: 'Número de Documento',
      value: (element: ChoferList) => element.numero_documento,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: ChoferList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: ChoferList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: ChoferList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: ChoferList) =>
        element.ciudad_nombre
          ? `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`
          : '',
    },
    {
      def: 'created_by',
      title: 'Usuario creación',
      value: (element: ChoferList) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha creación',
      value: (element: ChoferList) => element.created_at,
      type: 'date',
    },
    {
      def: 'modified_by',
      title: 'Usuario modificación',
      value: (element: ChoferList) => element.modified_by,
    },
    {
      def: 'modified_at',
      title: 'Fecha modificación',
      value: (element: ChoferList) => element.modified_at,
      type: 'date',
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: ChoferList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoDocumentoFilterList: string[] = [];
  tipoDocumentoFiltered: string[] = [];

  get isFilteredByCiudad(): boolean {
    return this.ciudadFiltered.length !== this.ciudadFilterList.length;
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
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter')
  tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private choferService: ChoferService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<ChoferList>): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.EDITAR}`, event.row.id]);
  }

  redirectToShow(event: TableEvent<ChoferList>): void {
    this.router.navigate([`/flota/${m.CHOFER}/${a.VER}`, event.row.id]);
  }

  deleteRow({ row }: TableEvent<ChoferList>): void {
    const message = `¿Está seguro que desea eliminar el Chofer ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.choferService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.choferService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: ChoferList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
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
    return filterByCiudad && filterByPais && filterByTipoDocumento;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoDocumentoFiltered =
      this.tipoDocumentoCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
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
    this.choferService.getList().subscribe((list) => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
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
    this.paisFiltered = this.paisFilterList.slice();
    this.tipoDocumentoFiltered = this.tipoDocumentoFilterList.slice();
  }
}
