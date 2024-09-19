import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoAccionEnum,
  PermisoModeloEnum as m,
  PermisoModeloEnum,
} from 'src/app/enums/permiso-enum';
import { filter } from 'rxjs/operators';
import { Column } from 'src/app/interfaces/column';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { createMovimiento } from 'src/app/utils/movimiento-utils';
import { ContraparteInfoMovimiento, ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';
import { LiquidacionFormDialogComponent } from 'src/app/dialogs/liquidacion-form-dialog/liquidacion-form-dialog.component';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { subtract } from 'src/app/utils/math';

type Filter = {
  camion_placa?: string;
  cuenta?: string;
  concepto?: string;
  tipo?: string;
  estado?: string;
};

@Component({
  selector: 'app-estado-cuenta-list-detalle',
  templateUrl: './estado-cuenta-list-detalle.component.html',
  styleUrls: ['./estado-cuenta-list-detalle.component.scss']
})
export class EstadoCuentaListDetalleComponent implements OnInit {
  a = PermisoAccionEnum;
  m = PermisoModeloEnum;
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  columns: Column[] = [
    {
      def: 'created_at',
      title: 'Fecha',
      value: (element: Movimiento) => element.created_at,
      type: 'only-date',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'id',
      title: 'ID Mov',
      value: (element: Movimiento) => element.id,
      sticky: false,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => element.camion_placa,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta.descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.tipo_movimiento_descripcion,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalleMovimiento',
      title: 'Detalle',
      value: (element: Movimiento) => element.detalleMovimiento,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'numero_documento_relacionado',
      title: 'N° OC',
      value: (element: Movimiento) => element.numero_documento_relacionado,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    /*{
      def: 'estado',
      title: 'Estado',
      value: (element: Movimiento) => element.estado,
    },
    /*{
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },*/
    {
      def: 'liquidacion',
      title: 'Liquidacion',
      value: (element: Movimiento) => element.liquidacion_id ?? 0,
      type: 'number',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: Movimiento) => element.pendiente,
      type: 'number',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: Movimiento) => element.confirmado,
      type: 'number',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
    {
      def: 'finalizado',
      title: LiquidacionEtapaEnum.FINALIZADO,
      value: (element: Movimiento) => element.finalizado,
      type: 'number',
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },
  ]

  buttons : ButtonList[] = [
    {
      color: 'warn',
      tooltip: 'Crear Movimiento',
      clases: 'buttons',
      styles: '',
      icon: 'add',
      label: 'MOVIMIENTO',
      iconClass: 'icon-add-style',
      buttonCallback: ($event:any) => {
        console.log('alerta desde button: ', $event);
        this.create();
      }
    },
    {
      color: 'primary',
      tooltip: 'Crear Liquidacion',
      clases: 'buttons',
      styles: '',
      icon: 'add',
      label: 'LIQUIDACION',
      iconClass: 'icon-add-style',
      buttonCallback: ($event:any) => {
        console.log('alerta desde button: ', $event);
        this.createLiquidacion();
      }
    }
  ]

  etapa?: LiquidacionEtapaEnum;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];
  isFiltered = false;

  //filtros check
  chapaFilterList: string[] = [];
  chapaFiltered: string[] = [];

  cuentaFilterList: string[] = [];
  cuentaFiltered: string[] = [];

  conceptoFilterList: string[] = [];
  conceptoFiltered: string[] = [];

  detalleFilterList: string[] = [];
  detalleFiltered: string[] = [];

  estadoFilterList: string[] = [];
  estadoFiltered: string[] = [];

  pendiente: number = 0;
  confirmado: number = 0;
  finalizado: number = 0;

  get isFilteredByChapa(): boolean {
    return (this.chapaFiltered.length !== this.chapaFilterList.length);
  }

  get isFilteredByCuenta(): boolean {
    return (this.cuentaFiltered.length !== this.cuentaFilterList.length);
  }

  get isFilteredByConcepto(): boolean {
    return (this.conceptoFiltered.length !== this.conceptoFilterList.length);
  }

  get isFilteredByDetalle(): boolean {
    return (this.detalleFiltered.length !== this.detalleFilterList.length);
  }

  get isFilteredByEstado(): boolean {
    return (this.estadoFilterList.length !== this.estadoFiltered.length);
  }

  get deberes(): number {
    let debito = this.list.reduce((acc, cur) => acc + (cur.pendiente ?? 0), 0);
    let credito = this.list.reduce((acc, cur) => acc + (cur.confirmado ?? 0), 0);
    return (credito + debito);
  }

  get pagos(): number {
    return this.list.reduce((acc, cur) => acc + (cur.finalizado ?? 0), 0);
  }

  get saldo(): number {
    let saldo = subtract(Math.abs(this.deberes), Math.abs(this.pagos));
    return saldo;
  }

  get totalPendiente(): number {
    return this.pendiente;
  }

  get totalConfirmado(): number {
    return this.confirmado;
  }

  get totalFinalizado(): number {
    return this.finalizado;
  }

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  @ViewChild('chapaCheckboxFilter')
  chapaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('cuentaCheckboxFilter')
  cuentaCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('conceptoCheckboxFilter')
  conceptoCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('detalleCheckboxFilter')
  detalleCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('estadoCheckboxFilter')
  estadoCheckboxFilter!: CheckboxFilterComponent;

  constructor(
    private route: ActivatedRoute,
    private estadoCuentaService: EstadoCuentaService,
    private movimientoService: MovimientoService,
    private reportsService: ReportsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router,
    ) { }

    ngOnInit(): void {
      this.getList();
    }

    downloadFile(): void {
      const {
        backUrl,
        etapa,
        contraparte_id,
        contraparte,
        contraparte_numero_documento,
        tipo_contraparte_id,
      } = this.route.snapshot.queryParams;

      this.movimientoService.generateReportsByEstadoCuenta(this.estadoCuenta!, contraparte_id).subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
    }

    filterPredicate(obj: Movimiento, filterJson: string): boolean {
      const filter: Filter = JSON.parse(filterJson);

      const filterByChapa = filter.camion_placa?.split('|')
          .some( (x) => obj.camion_placa.toLowerCase().indexOf(x) >= 0 ) ?? true;

      const filterByCuenta = filter.cuenta?.split('|')
          .some((x) => obj.cuenta_codigo_descripcion.toLowerCase().indexOf(x) >= 0) ?? true;

      const filterByConcepto = filter.concepto?.split('|')
          .some((x) => obj.tipo_movimiento_descripcion.toLowerCase().indexOf(x) >= 0) ?? true;

      const filterByDetalle = filter.tipo?.split('|')
          .some((x) => ((obj.tipo_movimiento_descripcion === 'Anticipo') ? obj.anticipo!.concepto : obj.tipo_movimiento_descripcion).toLowerCase().indexOf(x) >= 0) ?? true;

      const filterByEstado = filter.estado?.split('|')
          .some((x) => obj.estado.toLowerCase().indexOf(x) >= 0) ?? true;


      return filterByChapa && filterByCuenta && filterByConcepto && filterByDetalle && filterByEstado;
    }

    back(save: boolean): void {
      this.router.navigate([this.backUrl]);
    }

    applyFilter(): void {
      let filter: Filter = {};
      this.isFiltered = false;

      this.chapaFiltered =this.chapaCheckboxFilter.getFilteredList();
      this.cuentaFiltered = this.cuentaCheckboxFilter.getFilteredList();
      this.conceptoFiltered = this.conceptoCheckboxFilter.getFilteredList();
      this.detalleFiltered = this.detalleCheckboxFilter.getFilteredList();
      this.estadoFiltered = this.estadoCheckboxFilter.getFilteredList();

      if (this.isFilteredByChapa) {
        filter.camion_placa = this.chapaFiltered.join('|');
        this.isFiltered = true;
      }
      if (this.isFilteredByCuenta) {
        filter.cuenta = this.cuentaFiltered.join('|');
        this.isFiltered = true;
      }
      if (this.isFilteredByConcepto) {
        filter.concepto = this.conceptoFiltered.join('|');
        this.isFiltered = true;
      }
      if (this.isFilteredByDetalle) {
        filter.tipo = this.detalleFiltered.join('|');
        this.isFiltered = true;
      }
      if (this.isFilteredByEstado) {
        filter.estado = this.estadoFiltered.join('|');
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

    create(): void {
      const data: MovimientoFormDialogData = {
        estado: MovimientoEstadoEnum.PENDIENTE,
        es_contraparte_editable: true,
      };
      createMovimiento(data, this.dialog, this.snackbar, () => {
        this.getList();
      });
    }

    createLiquidacion():void {

      const {
        contraparte_id,
        contraparte,
        contraparte_numero_documento,
        tipo_contraparte_id,
        punto_venta_id
      } = this.route.snapshot.queryParams;

      const data: ContraparteInfoMovimientoLiq = {
        contraparte: contraparte,
        contraparte_id: contraparte_id,
        contraparte_numero_documento: contraparte_numero_documento,
        tipo_contraparte_id: tipo_contraparte_id,
        tipo_contraparte_descripcion: '',
        isNew: true,
        etapa: LiquidacionEtapaEnum.PENDIENTE,
        punto_venta_id: punto_venta_id
      };

      this.dialog
        .open(LiquidacionFormDialogComponent, {
          data,
          panelClass: 'half-dialog',
        })
        .afterClosed()
        //.pipe(filter((confirmed) => !!confirmed))
        .subscribe(() => {
          this.getList();
        });
    }

    private getList(): void {

      console.log('test');
      const {
        backUrl,
        etapa,
        contraparte_id,
        contraparte,
        contraparte_numero_documento,
        tipo_contraparte_id,
        punto_venta_id
      } = this.route.snapshot.queryParams;
      if (backUrl) {
        this.backUrl = backUrl;
      }
      this.etapa = etapa;

      this.estadoCuentaService
          .getByContraparte(
            tipo_contraparte_id,
            contraparte_id,
            contraparte,
            contraparte_numero_documento,
            punto_venta_id
          )
          .pipe(filter((e) => !!e))
          .subscribe((estadoCuenta) => {
            this.estadoCuenta = estadoCuenta!;
            this.getMovList();
      });

    }

    getMovList(): void {
      const etapa = this.etapa! as LiquidacionEtapaEnum;

      this.movimientoService
        .getListByEstadoCuentaDetalle(
              this.estadoCuenta!,
              this.estadoCuenta!.contraparte_id,
              undefined,
              this.estadoCuenta!.punto_venta_id
        )
        .subscribe((data) => {

          data.forEach(element =>{
            element.detalleMovimiento = ((element.tipo_movimiento_descripcion === 'Anticipo') ? element.anticipo?.concepto : element.tipo_movimiento_descripcion)
          })

          this.list = data;
          this.movimientosSelected = [];

          this.createFiltersList();

          this.resetFilterList();
        });
    }

    createFiltersList(){

      this.chapaFilterList = getFilterList(this.list,(x) => x.camion_placa);

      this.cuentaFilterList = getFilterList(this.list, (x) => x.cuenta_codigo_descripcion);

      this.conceptoFilterList = getFilterList(this.list, (x) => x.tipo_movimiento_descripcion);

      this.detalleFilterList = getFilterList(this.list, (x) =>
        ((x.tipo_movimiento_descripcion === 'Anticipo') ? x.anticipo?.concepto : x.tipo_movimiento_descripcion),
      );

      this.estadoFilterList = getFilterList(this.list, (x) => x.estado);

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
      this.chapaFiltered = this.chapaFilterList.slice();
      this.cuentaFiltered = this.cuentaFilterList.slice();
      this.conceptoFiltered = this.conceptoFilterList.slice();
      this.detalleFiltered = this.detalleFilterList.slice();
      this.estadoFiltered = this.estadoFilterList.slice();
    }

}
