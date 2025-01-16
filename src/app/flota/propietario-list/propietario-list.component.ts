import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { PropietarioList } from 'src/app/interfaces/propietario';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { PropietarioService } from 'src/app/services/propietario.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  ciudad?: string;
  pais?: string;
  tipo_persona?: string;
};

@Component({
  selector: 'app-propietario-list',
  templateUrl: './propietario-list.component.html',
  styleUrls: ['./propietario-list.component.scss'],
})
export class PropietarioListComponent implements OnInit {
  modelo = m.PROPIETARIO;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: PropietarioList) => element.id,
     
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: PropietarioList) => element.estado.toUpperCase(),
     
    },
    {
      def: 'nombre',
      title: 'Propietarios',
      value: (element: PropietarioList) => element.nombre,
    
    },
    {
      def: 'ruc',
      title: 'Nº de Doc.',
      value: (element: PropietarioList) => element.ruc,
    },
    // {
    //   def: 'tipo_persona',
    //   title: 'Comp. Jurídica',
    //   value: (element: PropietarioList) => element.tipo_persona_descripcion,
    // },

    {
      def: 'telefono',
      title: 'Celular',
      value: (element: PropietarioList) => element.telefono,
    },
    {
      def: 'direccion',
      title: 'Dirección',
      value: (element: PropietarioList) => element.direccion,
    },

    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: PropietarioList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: PropietarioList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: PropietarioList) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: PropietarioList) => this.formatDate(element.created_at),
    },
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: PropietarioList) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: PropietarioList) => element.modified_at,
    //   type: 'date',
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: PropietarioList[] = [];
  ciudadFilterList: string[] = [];
  ciudadFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  tipoPersonaFilterList: string[] = [];
  tipoPersonaFiltered: string[] = [];

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

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length;
  }

  get isFilteredByTipoPersona(): boolean {
    return (
      this.tipoPersonaFiltered.length !== this.tipoPersonaFilterList.length
    );
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('ciudadCheckboxFilter')
  ciudadCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoPersonaCheckboxFilter')
  tipoPersonaCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private propietarioService: PropietarioService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.PROPIETARIO}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<PropietarioList>): void {
    this.router.navigate([
      `/flota/${m.PROPIETARIO}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<PropietarioList>): void {
    this.router.navigate([
      `/flota/${m.PROPIETARIO}/${a.VER}`,
      event.row.id,
    ]);
  }

  deleteRow({ row }: TableEvent<PropietarioList>): void {
    const message = `¿Está seguro que desea eliminar el Propietario ${row.nombre}?`;
    this.dialog.confirmationToDelete(
      message,
      this.propietarioService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.propietarioService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: PropietarioList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByCiudad =
      filter.ciudad
        ?.split('|')
        .some((x) => obj.ciudad_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    const filterByPais =
      filter.pais
        ?.split('|')
        .some((x) => obj.pais_nombre.toLowerCase().indexOf(x) >= 0) ?? true;
    // const filterByTipoPersona =
    //   filter.tipo_persona
    //     ?.split('|')
    //     .some(
    //       (x) => obj.tipo_persona_descripcion.toLowerCase().indexOf(x) >= 0
    //     ) ?? true;
    return filterByCiudad && filterByPais;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.ciudadFiltered = this.ciudadCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.tipoPersonaFiltered = this.tipoPersonaCheckboxFilter.getFilteredList();
    if (this.isFilteredByCiudad) {
      filter.ciudad = this.ciudadFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipoPersona) {
      filter.tipo_persona = this.tipoPersonaFiltered.join('|');
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
    this.propietarioService.getList().subscribe((list) => {
      this.list = list;
      this.ciudadFilterList = getFilterList(list, (x) => x.ciudad_nombre);
      this.paisFilterList = getFilterList(list, (x) => x.pais_nombre);
      // this.tipoPersonaFilterList = getFilterList(
      //   list,
      //   (x) => x.tipo_persona_descripcion
      // );
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
    this.tipoPersonaFiltered = this.tipoPersonaFilterList.slice();
  }
}
