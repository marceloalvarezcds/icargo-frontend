import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { SemiList } from 'src/app/interfaces/semi';
import { TableEvent } from 'src/app/interfaces/table';
import { DialogService } from 'src/app/services/dialog.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SemiService } from 'src/app/services/semi.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  clasificacion?: string;
  marca?: string;
  pais?: string;
  propietario?: string;
  tipo?: string;
  tipo_carga?: string;
};

@Component({
  selector: 'app-semi-list',
  templateUrl: './semi-list.component.html',
  styleUrls: ['./semi-list.component.scss'],
})
export class SemiListComponent implements OnInit {
  modelo = m.SEMIRREMOLQUE;
  columns: Column[] = [
    {
      def: 'id',
      title: 'Nº',
      value: (element: SemiList) => element.id,
      sticky: true,
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: SemiList) => element.estado,
    },
    {
      def: 'placa',
      title: 'Chapa',
      value: (element: SemiList) => element.placa,
    },
    {
      def: 'pais_emisor_placa',
      title: 'País Emisor de la Chapa',
      value: (element: SemiList) => element.pais_emisor_placa_nombre,
    },
    {
      def: 'propietario',
      title: 'Propietario',
      value: (element: SemiList) =>
        `${element.propietario_nombre} - ${element.propietario_ruc}`,
    },
    {
      def: 'clasificacion',
      title: 'Clasificación',
      value: (element: SemiList) => element.clasificacion_descripcion,
    },
    {
      def: 'tipo',
      title: 'Tipo Semi',
      value: (element: SemiList) => element.tipo_descripcion,
    },
    {
      def: 'tipo_carga',
      title: 'Tipo Carga',
      value: (element: SemiList) => element.tipo_carga_descripcion,
    },
    {
      def: 'marca',
      title: 'Marca',
      value: (element: SemiList) => element.marca_descripcion,
    },
    {
      def: 'gestor_cuenta_nombre',
      title: 'Gestor de Cuenta',
      value: (element: SemiList) => element.gestor_cuenta_nombre,
    },
    {
      def: 'oficial_cuenta_nombre',
      title: 'Oficial de Cuenta',
      value: (element: SemiList) => element.oficial_cuenta_nombre,
    },
    {
      def: 'created_by',
      title: 'Usuario',
      value: (element: SemiList) => element.created_by,
    },
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: SemiList) => element.created_at,
      type: 'date',
    },
    // {
    //   def: 'modified_by',
    //   title: 'Usuario modificación',
    //   value: (element: SemiList) => element.modified_by,
    // },
    // {
    //   def: 'modified_at',
    //   title: 'Fecha modificación',
    //   value: (element: SemiList) => element.modified_at,
    //   type: 'date',
    // },
    { def: 'actions', title: 'Acciones', stickyEnd: true },
  ];

  isFiltered = false;
  list: SemiList[] = [];
  clasificacionFilterList: string[] = [];
  clasificacionFiltered: string[] = [];
  marcaFilterList: string[] = [];
  marcaFiltered: string[] = [];
  paisFilterList: string[] = [];
  paisFiltered: string[] = [];
  propietarioFilterList: string[] = [];
  propietarioFiltered: string[] = [];
  tipoFilterList: string[] = [];
  tipoFiltered: string[] = [];
  tipoCargaFilterList: string[] = [];
  tipoCargaFiltered: string[] = [];

  get isFilteredByClasificacion(): boolean {
    return (
      this.clasificacionFiltered.length !== this.clasificacionFilterList.length
    );
  }

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

  get isFilteredByTipoCarga(): boolean {
    return this.tipoCargaFiltered.length !== this.tipoCargaFilterList.length;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('clasificacionCheckboxFilter')
  clasificacionCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('marcaCheckboxFilter')
  marcaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('paisCheckboxFilter') paisCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('propietarioCheckboxFilter')
  propietarioCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoCheckboxFilter') tipoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('tipoCargaCheckboxFilter')
  tipoCargaCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private semiService: SemiService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: DialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  redirectToCreate(): void {
    this.router.navigate([`/flota/${m.SEMIRREMOLQUE}/${a.CREAR}`]);
  }

  redirectToEdit(event: TableEvent<SemiList>): void {
    this.router.navigate([
      `/flota/${m.SEMIRREMOLQUE}/${a.EDITAR}`,
      event.row.id,
    ]);
  }

  redirectToShow(event: TableEvent<SemiList>): void {
    this.router.navigate([`/flota/${m.SEMIRREMOLQUE}/${a.VER}`, event.row.id]);
  }

  deleteRow({ row }: TableEvent<SemiList>): void {
    const message = `¿Está seguro que desea eliminar el Semi-remolque con placa ${row.placa}?`;
    this.dialog.confirmationToDelete(
      message,
      this.semiService.delete(row.id),
      () => {
        this.getList();
      }
    );
  }

  downloadFile(): void {
    this.semiService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: SemiList, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByClasificacion =
      filter.clasificacion
        ?.split('|')
        .some(
          (x) => obj.clasificacion_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    const filterByMarca =
      filter.marca
        ?.split('|')
        .some((x) => obj.marca_descripcion.toLowerCase().indexOf(x) >= 0) ??
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
    const filterByTipoCarga =
      filter.tipo_carga
        ?.split('|')
        .some(
          (x) => obj.tipo_carga_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    return (
      filterByClasificacion &&
      filterByMarca &&
      filterByPais &&
      filterByPropietario &&
      filterByTipo &&
      filterByTipoCarga
    );
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.clasificacionFiltered =
      this.clasificacionCheckboxFilter.getFilteredList();
    this.marcaFiltered = this.marcaCheckboxFilter.getFilteredList();
    this.paisFiltered = this.paisCheckboxFilter.getFilteredList();
    this.propietarioFiltered = this.propietarioCheckboxFilter.getFilteredList();
    this.tipoFiltered = this.tipoCheckboxFilter.getFilteredList();
    this.tipoCargaFiltered = this.tipoCargaCheckboxFilter.getFilteredList();
    if (this.isFilteredByClasificacion) {
      filter.clasificacion = this.clasificacionFiltered.join('|');
      this.isFiltered = true;
    }
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
    if (this.isFilteredByTipoCarga) {
      filter.tipo_carga = this.tipoCargaFiltered.join('|');
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
    this.semiService.getList().subscribe((list) => {
      this.list = list;
      this.clasificacionFilterList = getFilterList(
        list,
        (x) => x.clasificacion_descripcion
      );
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
      this.tipoCargaFilterList = getFilterList(
        list,
        (x) => x.tipo_carga_descripcion
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
    this.clasificacionFiltered = this.clasificacionFilterList.slice();
    this.marcaFiltered = this.marcaFilterList.slice();
    this.paisFiltered = this.paisFilterList.slice();
    this.propietarioFiltered = this.propietarioFilterList.slice();
    this.tipoFiltered = this.tipoFilterList.slice();
    this.tipoCargaFiltered = this.tipoCargaFilterList.slice();
  }
}
