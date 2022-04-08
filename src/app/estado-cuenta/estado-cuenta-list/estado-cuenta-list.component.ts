import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';

type Filter = {
  tipo_contraparte_descripcion?: string;
  contraparte?: string;
};

@Component({
  selector: 'app-estado-cuenta-list',
  templateUrl: './estado-cuenta-list.component.html',
  styleUrls: ['./estado-cuenta-list.component.scss'],
})
export class EstadoCuentaListComponent implements OnInit {
  modelo = m.MOVIMIENTO;
  columns: Column[] = [
    {
      def: 'tipo_contraparte_descripcion',
      title: 'Tipo de Contraparte',
      value: (element: EstadoCuenta) => element.tipo_contraparte_descripcion,
    },
    {
      def: 'contraparte',
      title: 'Contraparte',
      value: (element: EstadoCuenta) => element.contraparte,
    },
    {
      def: 'contraparte_numero_documento',
      title: 'Nº de Doc. Contraparte',
      value: (element: EstadoCuenta) => element.contraparte_numero_documento,
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: EstadoCuenta) => element.pendiente,
      link: (element: EstadoCuenta) =>
        element.cantidad_pendiente > 0
          ? {
              url: [`/estado-cuenta/${m.LIQUIDACION}/${a.CREAR}`],
              queryParams: getQueryParams(
                element,
                LiquidacionEtapaEnum.PENDIENTE
              ),
            }
          : undefined,
      type: 'number',
    },
    {
      def: 'en_proceso',
      title: LiquidacionEtapaEnum.EN_PROCESO,
      value: (element: EstadoCuenta) => element.en_proceso,
      link: (element: EstadoCuenta) => ({
        url: [`/estado-cuenta/${m.LIQUIDACION}/${a.LISTAR}`],
        queryParams: getQueryParams(element, LiquidacionEtapaEnum.EN_PROCESO),
      }),
      type: 'number',
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: EstadoCuenta) => element.confirmado,
      link: (element: EstadoCuenta) =>
        element.cantidad_confirmado > 0
          ? {
              url: [`/estado-cuenta/${m.LIQUIDACION}/${a.LISTAR}`],
              queryParams: getQueryParams(
                element,
                LiquidacionEtapaEnum.CONFIRMADO
              ),
            }
          : undefined,
      type: 'number',
    },
    {
      def: 'finalizado',
      title: LiquidacionEtapaEnum.FINALIZADO,
      value: (element: EstadoCuenta) => element.finalizado,
      link: (element: EstadoCuenta) =>
        element.cantidad_finalizado > 0
          ? {
              url: [`/estado-cuenta/${m.MOVIMIENTO}/${a.LISTAR}`],
              queryParams: getQueryParams(
                element,
                LiquidacionEtapaEnum.FINALIZADO
              ),
            }
          : undefined,
      type: 'number',
    },
  ];

  isFiltered = false;
  list: EstadoCuenta[] = [];
  tipoContraparteFilterList: string[] = [];
  tipoContraparteFiltered: string[] = [];
  contraparteFilterList: string[] = [];
  contraparteFiltered: string[] = [];

  get isFilteredByTipoContraparte(): boolean {
    return (
      this.tipoContraparteFiltered.length !==
      this.tipoContraparteFilterList.length
    );
  }

  get isFilteredByProducto(): boolean {
    return (
      this.contraparteFiltered.length !== this.contraparteFilterList.length
    );
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private estadoCuentaService: EstadoCuentaService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  downloadFile(): void {
    this.estadoCuentaService.generateReports().subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  filterPredicate(obj: EstadoCuenta, filterJson: string): boolean {
    const filter: Filter = JSON.parse(filterJson);
    const filterByTipoContraparte =
      filter.tipo_contraparte_descripcion
        ?.split('|')
        .some(
          (x) => obj.tipo_contraparte_descripcion.toLowerCase().indexOf(x) >= 0
        ) ?? true;
    const filterByContraparte =
      filter.contraparte
        ?.split('|')
        .some((x) => obj.contraparte.toLowerCase().indexOf(x) >= 0) ?? true;
    return filterByTipoContraparte && filterByContraparte;
  }

  applyFilter(): void {
    let filter: Filter = {};
    this.isFiltered = false;
    this.tipoContraparteFiltered =
      this.tipoContraparteCheckboxFilter.getFilteredList();
    this.contraparteFiltered = this.contraparteCheckboxFilter.getFilteredList();
    if (this.isFilteredByTipoContraparte) {
      filter.tipo_contraparte_descripcion =
        this.tipoContraparteFiltered.join('|');
      this.isFiltered = true;
    }
    if (this.isFilteredByProducto) {
      filter.contraparte = this.contraparteFiltered.join('|');
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
    this.estadoCuentaService.getListByGestorCarga().subscribe((list) => {
      this.list = list;
      this.tipoContraparteFilterList = getFilterList(
        list,
        (x) => x.tipo_contraparte_descripcion
      );
      this.contraparteFilterList = getFilterList(list, (x) => x.contraparte);
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
    this.tipoContraparteFiltered = this.tipoContraparteFilterList.slice();
    this.contraparteFiltered = this.contraparteFilterList.slice();
  }
}
