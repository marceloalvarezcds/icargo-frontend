import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { CamionList } from 'src/app/interfaces/camion';
import { Column } from 'src/app/interfaces/column';
import { TableEvent } from 'src/app/interfaces/table';
import { CamionService } from 'src/app/services/camion.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  marca?: string;
  pais?: string;
  propietario?: string;
  tipo?: string;
};

@Component({
  selector: 'app-camion-list',
  templateUrl: './camion-list.component.html',
  styleUrls: ['./camion-list.component.scss'],
})
export class CamionListComponent implements OnInit {
  modelo = m.CAMION;
  columns: Column[] = [
    {
      def: 'id',
      title: 'ID',
      value: (element: CamionList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: CamionList) => element.estado,
      sticky: true,
    },
    {
      def: 'placa',
      title: 'Chapa',
      value: (element: CamionList) => element.placa,
    },
    {
      def: 'pais_emisor_placa',
      title: 'País Emisor de la Chapa',
      value: (element: CamionList) => element.pais_emisor_placa_nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: CamionList) =>
        `${element.propietario_nombre} - ${element.propietario_ruc}`,
    },
    {
      def: 'chofer',
      title: 'Chofer',
      value: (element: CamionList) =>
        element.chofer_nombre
          ? `${element.chofer_nombre} - ${element.chofer_numero_documento}`
          : '',
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: CamionList) => element.marca_descripcion,
    },
    {
      def: 'limites',
      title: 'Límites',
      value: (element: CamionList) => element.limites,
    },
    {
      def: 'tipo',
      title: 'Tipo de Tracto',
      value: (element: CamionList) => element.tipo_descripcion,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: CamionList) => element.gestor_cuenta_nombre,
    },
    // {
    //   def: 'oficial_cuenta_nombre',
    //   title: 'Oficial de Cuenta',
    //   value: (element: CamionList) => element.oficial_cuenta_nombre,
    // },
    // {
    //   def: 'created_by',
    //   title: 'Usuario creación',
    //   value: (element: CamionList) => element.created_by,
    // },
    // {
    //   def: 'created_at',
    //   title: 'Fecha creación',
    //   value: (element: CamionList) => element.created_at,
    //   type: 'date',
    // },
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: CamionList) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: CamionList) => element.modified_at,
    //   type: 'date',
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: CamionList[] = [];
  marcaFilterList: string[] = [];
  marcaFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  propietarioFilterList: string[] = [];
  propietarioFiltered: string[] = [];
  tipoFilterList: string[] = [];
  tipoFiltered: string[] = [];

  get isFilteredByMarca(): boolean {
    return this.marcaFiltered.length !== this.marcaFilterList.length;
  }

  get isFilteredByPais(): boolean {
    return this.paisFiltered.length !== this.paisFilterList.length;
  }

  get isFilteredByPropietario(): boolean {
    return (
      this.propietarioFiltered.length !== this.propietarioFilterList.length
    );
  }

  get isFilteredByTipo(): boolean {
    return this.tipoFiltered.length !== this.tipoFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('marcaCheckboxFilter')
  marcaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('propietarioCheckboxFilter')
  propietarioCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoCheckboxFilter') tipoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private camionService: CamionService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.CAMION}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<CamionList>): void {
    this.router.navigate([`/flota/${m.CAMION}/${a.EDITAR}`, event.row.id]);
  }

  redirectToShow(event: TableEvent<CamionList>): void {
    this.router.navigate([`/flota/${m.CAMION}/${a.VER}`, event.row.id]);
  }

  deleteRow({ row }: TableEvent<CamionList>): void {
    const message = `¿Está seguro que desea eliminar el Tracto con placa ${row.placa}?`;
    this.dialog.confirmationToDelete(
      message,
      this.camionService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.camionService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: CamionList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByMarca =
      filter.marca
        ?.split('|')
        .some((x) => obj.marca_descripcion ? obj.marca_descripcion.toLowerCase().indexOf(x) >= 0 : false) ?? true;
        // .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
    const filterByPais =
      filter.pais
        ?.split('|')
        .some(
          (x) => obj.pais_emisor_placa_nombre.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    const filterByPropietario =
      filter.propietario
        ?.split('|')
        .some((x) => obj.propietario_nombre.toLowerCase().indexOf(x) >= 0) ??
      true;
    const filterByTipo =
      filter.tipo
        ?.split('|')
        .some((x) => obj.tipo_descripcion.toLowerCase().indexOf(x) >= 0) ??
      true;
    return filterByMarca && filterByPais && filterByPropietario && filterByTipo;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.marcaFiltered = this.marcaCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.propietarioFiltered = this.propietarioCheckboxFilter.getFilteredList();
    this.tipoFiltered = this.tipoCheckboxFilter.getFilteredList();
    if (this.isFilteredByMarca) {
      filter.marca = this.marcaFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPais) {
      filter.pais = this.paisFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByPropietario) {
      filter.propietario = this.propietarioFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByTipo) {
      filter.tipo = this.tipoFiltered.join('|');
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
    this.camionService.getList().subscribe((list) => {
      this.list = list;
      this.marcaFilterList = getFilterList(list, (x) => x.marca_descripcion);
      this.paisFilterList = getFilterList(
        list,
        (x) => x.pais_emisor_placa_nombre
      );
      this.propietarioFilterList = getFilterList(
        list,
        (x) => x.propietario_nombre
      );
      this.tipoFilterList = getFilterList(list, (x) => x.tipo_descripcion);
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
    this.marcaFiltered = this.marcaFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
    this.propietarioFiltered = this.propietarioFilterList.slice();
    this.tipoFiltered = this.tipoFilterList.slice();
  }
}
