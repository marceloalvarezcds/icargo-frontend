import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, Renderer2 } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum,
  PermisoModeloEnum,
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { RemitenteList } from 'src/app/interfaces/remitente';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { RemitenteService } from 'src/app/services/remitente.service';
import { ReportsService } from 'src/app/services/reports.service';
import { ResponsiveService } from 'src/app/services/responsive.service';
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
  selector: 'app-remitente-list',
  templateUrl: './remitente-list.component.html',
  styleUrls: ['./remitente-list.component.scss'],
})
export class RemitenteListComponent implements OnInit {
  modelo = m.REMITENTE;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: RemitenteList) => element.id,

    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: RemitenteList) => element.estado.toUpperCase(),

    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: RemitenteList) => this.formatDate(element.created_at),

    },
    {
      def: 'nombre',
      title: 'Clientes',
      value: (element: RemitenteList) => element.nombre,

    },
    // {
    //   def: 'nombre_corto',
    //   title: 'Nombre de Fantasía',
    //   value: (element: RemitenteList) => element.nombre_corto,
    // },
    {
      def: 'tipo_documento',
      title: 'Tipo',
      value: (element: RemitenteList) => element.tipo_documento_descripcion,
    },
    {
      def: 'numero_documento',
      title: 'Documento',
      value: (element: RemitenteList) => element.numero_documento,
    },
    {
      def: 'composicion_juridica',
      title: 'Tipo',
      value: (element: RemitenteList) => element.composicion_juridica_nombre,
    },
    {
      def: 'telefono',
      title: 'Celular',
      value: (element: RemitenteList) => element.telefono,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: RemitenteList) => element.direccion,
    },
    {
      def: 'ubicacion',
      title: 'Ubicación',
      value: (element: RemitenteList) =>
        element.ciudad_nombre
          ? `${element.ciudad_nombre}/${element.localidad_nombre}/${element.pais_nombre_corto}`
          : '',
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: RemitenteList) => element.created_by,
    },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: RemitenteList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  composicionJuridicaFilterList: string[] = [];
  composicionJuridicaFiltered: string[] = [];
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

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length;
  }

  get isFilteredByTipoDocumento(): boolean {
    return (
      this.tipoDocumentoFiltered.length !== this.tipoDocumentoFilterList.length
    );
  }

  @ViewChild(MatAccordion)
  accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter')
  ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('composicionJuridicaCheckboxFilter')
  composicionJuridicaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter')
  paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoDocumentoCheckboxFilter')
  tipoDocumentoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private remitenteService: RemitenteService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router,
    private responsiveService: ResponsiveService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  a = PermisoAccionEnum;
  sidebarMode: MatDrawerMode = 'side';

  @Input() hideBack = true;
  @Input() hideCreate = false;
  @Input() hideFilter = false;
  @Input() module = '';
  @Input() submodule = '';
  @Input() viewTitle = '';
  @Input() modeloList?: PermisoModeloEnum;

  @Output() applyClick = new EventEmitter<MouseEvent>();
  @Output() backClick = new EventEmitter<boolean>();
  @Output() createClick = new EventEmitter<MouseEvent>();
  @Output() downloadClick = new EventEmitter<MouseEvent>();
  @Output() resetClick = new EventEmitter<MouseEvent>();

  @ViewChild('sidenav') sidenav?: MatSidenav;

  @HostListener('window:resize')
  onResize(): void {
    this.configSidebarMode();
  }

  private configSidebarMode(): void {
    setTimeout(() => {
      if (this.responsiveService.isMobileScreen) {
        this.sidebarMode = 'over';
        this.sidenav!.close();
      } else {
        this.sidebarMode = 'side';
      }
    });
  }
  // redirectToCreate(): void {
  //   this.router.navigate([`/entities/${m.REMITENTE}/${a.CREAR}`]);
  // }

  // redirectToEdit(event: TableEvent<RemitenteList>): void {
  //   this.router.navigate([
  //     `/entities/${m.REMITENTE}/${a.EDITAR}`,
  //     event.row.id,
  //   ]);
  // }

  // redirectToShow(event: TableEvent<RemitenteList>): void {
  //   this.router.navigate([`/entities/${m.REMITENTE}/${a.VER}`, event.row.id]);
  // }

  redirectToCreate(): void {
    const url = `/entities/${m.REMITENTE}/${a.CREAR}`;
    window.open(url, '_blank');
  }

  redirectToEdit(event: TableEvent<RemitenteList>): void {
    const url = `/entities/${m.REMITENTE}/${a.EDITAR}/${event.row.id}`;
    window.open(url, '_blank');
  }

  redirectToShow(event: TableEvent<RemitenteList>): void {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      this.renderer.addClass(input, 'highlight-border');
    });
    const url = `/entities/${m.REMITENTE}/${a.VER}/${event.row.id}`;
    window.open(url, '_blank');
    setTimeout(() => {
      inputs.forEach(input => {
        this.renderer.removeClass(input, 'highlight-border');
      });
    }, 2000); // Cambia el retardo según sea necesario
  }

  deleteRow({ row }: TableEvent<RemitenteList>): void {
    const message = `¿Está seguro que desea eliminar el Remitente ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.remitenteService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.remitenteService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: RemitenteList, filterJson: string): boolean {
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
    this.remitenteService.getList().subscribe((list) => {
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
