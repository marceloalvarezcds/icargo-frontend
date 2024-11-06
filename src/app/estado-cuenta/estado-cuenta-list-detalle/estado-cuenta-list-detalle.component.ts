import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { Movimiento, MovimientoEstadoCuenta } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SearchService } from 'src/app/services/search.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CheckboxFilterComponent } from 'src/app/shared/checkbox-filter/checkbox-filter.component';
import { createMovimiento, deleteMovimiento,
  editMovimiento } from 'src/app/utils/movimiento-utils';
import { ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';
import { LiquidacionFormDialogComponent } from 'src/app/dialogs/liquidacion-form-dialog/liquidacion-form-dialog.component';
import { ButtonList } from 'src/app/interfaces/buttonList';
import { AfectadoEnum } from 'src/app/enums/afectado-enum';
import { MovimientoFleteEditFormDialogData } from 'src/app/interfaces/movimiento-flete-edit-form-dialog-data';
import { MovimientoEditByFleteFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-flete-form-dialog/movimiento-edit-by-flete-form-dialog.component';
import { MovimientoEditByMermaFormDialogComponent } from 'src/app/dialogs/movimiento-edit-by-merma-form-dialog/movimiento-edit-by-merma-form-dialog.component';
import { MovimientoMermaEditFormDialogData } from 'src/app/interfaces/movimiento-merma-edit-form-dialog-data';

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
  isShowOnly = false;

  columns: Column[] = [
    {
      def: 'movimiento_id',
      title: 'ID Mov',
      value: (element: MovimientoEstadoCuenta) => element.movimiento_id ?? '',
      //sticky: true,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'estado',
      title: 'Estado',
      value: (element: MovimientoEstadoCuenta) => element.estado,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'fecha',
      title: 'Fecha',
      value: (element: MovimientoEstadoCuenta) => element.fecha,
      type: 'only-date',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    /*{
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => element.camion_placa,
      dinamicStyles: (element: Movimiento) => ((element.tipo_movimiento_descripcion === 'Flete') ? {color: 'blue','font-size': '13px'} : ""),
    },*/
    {
      def: 'tipo_cuenta_descripcion',
      title: 'Cuenta',
      value: (element: MovimientoEstadoCuenta) => element.tipo_cuenta_descripcion,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'tipo_movimiento_concepto',
      title: 'Concepto',
      value: (element: MovimientoEstadoCuenta) => element.tipo_movimiento_concepto,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'detalle_desc',
      title: 'Detalle',
      value: (element: MovimientoEstadoCuenta) => element.detalle,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'nro_documento_relacionado',
      title: 'N° OC',
      value: (element: MovimientoEstadoCuenta) => element.nro_documento_relacionado,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'info',
      title: 'Info',
      value: (element: MovimientoEstadoCuenta) => (element.tipo_movimiento_concepto === 'Pago/Cobro') ? ('Factura: ' + (element.info ?? ''))  : element.info,
      //value: (element: MovimientoEstadoCuenta) => 'info',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    /*{
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },*/
    {
      def: 'liquidacion',
      title: 'N° Liq.',
      value: (element: MovimientoEstadoCuenta) => element.liquidacion_id ?? '',
      type: 'number',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'estado_liquidacion',
      title: 'Estado Liquidacion',
      value: (element: MovimientoEstadoCuenta) => element.estado_liquidacion,
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: MovimientoEstadoCuenta) => element.pendiente,
      type: 'number',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: MovimientoEstadoCuenta) => element.confirmado,
      type: 'number',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'finalizado',
      title: 'Pago/Cobro',
      value: (element: MovimientoEstadoCuenta) => element.finalizado,
      type: 'number',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    {
      def: 'movimiento_saldo',
      title: 'Saldo Acumulado',
      value: (element: MovimientoEstadoCuenta) => element.movimiento_saldo,
      type: 'number',
      dinamicStyles: (element: MovimientoEstadoCuenta) =>
        (
          (element.tipo_movimiento_concepto === 'Flete') ? {color: 'blue'} :
          (element.tipo_movimiento_concepto === 'Pago/Cobro') ? { 'background-color': '#e0e0e0'} : ""
        ),
    },
    /*{
      def: 'oc',
      title: '',
      type: 'button',
      value: (mov: MovimientoEstadoCuenta) => (mov.es_editable ? '' : 'Ver OC'),
      buttonCallback: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable
          ? () => {}
          : redirectToShowOCByMovimiento(this.router, mov),
      buttonIconName: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable ? '' : 'visibility',
      stickyEnd: true,
    },*/
    {
      def: 'editar',
      title: ' ',
      type: 'button',
      value: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable && mov.estado === 'Pendiente' || mov.can_edit_oc ? 'Editar' : '',
      buttonCallback: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable && mov.estado === 'Pendiente'
          ? this.edit(mov)
          : () => {},
      buttonIconName: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable && mov.estado === 'Pendiente' || mov.can_edit_oc ? 'edit' : '',
      //stickyEnd: true,
    },
    {
      def: 'delete',
      title: ' ',
      type: 'button',
      value: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable ? 'Eliminar Movimiento' : '',
      buttonCallback: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable && mov.estado === 'Pendiente' ? this.delete(mov) : undefined,
      buttonIconName: (mov: MovimientoEstadoCuenta) =>
        mov.es_editable && mov.estado === 'Pendiente' ? 'delete' : '',
      //sticky: true,
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

  get pendientes(): number {
    let debito = this.list.reduce((acc, cur) => acc + ( (cur.estado === 'Pendiente') ? cur.pendiente ?? 0 : 0), 0);
    return debito;
  }

  get deberes(): number {
    let credito = this.list.reduce((acc, cur) => acc + ( (true) ? cur.confirmado ?? 0 : 0), 0);
    return credito;
  }

  get pagos(): number {
    return this.list.reduce((acc, cur) => acc + (cur.finalizado ?? 0), 0);
  }

  get saldo(): number {
    //let debito = this.list.reduce((acc, cur) => acc + ( cur.pendiente ?? 0 ), 0);
    let credito = this.list.reduce((acc, cur) => acc + ( cur.confirmado ?? 0 ), 0);
    return  credito + this.pagos;
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

      /*this.movimientoService.generateReportsByEstadoCuenta(this.estadoCuenta!, contraparte_id)
        .subscribe((filename) => {
          this.reportsService.downloadFile(filename).subscribe((file) => {
            saveAs(file, filename);
          });
      });*/

      this.movimientoService
        .getReportListByEstadoCuentaDetalle(
              this.estadoCuenta!,
              this.estadoCuenta!.contraparte_id,
              undefined,
              this.estadoCuenta!.punto_venta_id
        ).subscribe((filename) => {
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
        contraparte_id: this.estadoCuenta?.contraparte_id,
        tipo_contraparte_id: this.estadoCuenta?.tipo_contraparte_id,
        tipo_contraparte_descripcion: this.estadoCuenta?.tipo_contraparte_descripcion,
        contraparte: this.estadoCuenta?.contraparte,
        contraparte_numero_documento: this.estadoCuenta?.contraparte_numero_documento,
        es_contraparte_editable: false,
        item: undefined,
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
          panelClass: 'full-dialog',
        })
        .afterClosed()
        //.pipe(filter((confirmed) => !!confirmed))
        .subscribe(() => {
          this.getList();
        });
    }

    private delete(mov: MovimientoEstadoCuenta): void {
      this.movimientoService.getById(mov.movimiento_id)
        .subscribe( (resp:Movimiento) => {
          deleteMovimiento(
            resp,
            this.dialog,
            this.movimientoService,
            this.snackbar,
            () => {
              this.getList();
            }
          );

      });
    }

    private edit(item: MovimientoEstadoCuenta): void {
      // obtenemos movimiento por id y llamamos al dialog
      this.movimientoService.getById(item.movimiento_id)
        .subscribe( (resp:Movimiento) => {

          const data: MovimientoFormDialogData = {
            estado: MovimientoEstadoEnum.EN_PROCESO,
            es_contraparte_editable: false,
            item: resp,
          };
          editMovimiento(data, this.dialog, this.snackbar, () => {
            this.getList();
          });

      });
    }

    /*
    private editOC(item: MovimientoEstadoCuenta): void {
      let afectado = item.es_propietario
        ? AfectadoEnum.PROPIETARIO
        : item.es_gestor
        ? AfectadoEnum.GESTOR
        : null;

      if (afectado) {
        if (item.es_flete) {
          edit(
            this.getFleteDialogRef(item, afectado),
            //this.emitOcChange.bind(this)
            ()=>{}
          );
        } else if (item.es_merma) {
          edit(
            this.getMermaDialogRef(item, afectado),
            //this.emitOcChange.bind(this)
            ()=>{}
          );
        }
      }
    }*/

    private getFleteDialogRef(
      item: Movimiento,
      afectado: AfectadoEnum
    ): MatDialogRef<MovimientoEditByFleteFormDialogComponent> {
      const data: MovimientoFleteEditFormDialogData = {
        afectado,
        item,
      };
      return this.dialog.open(MovimientoEditByFleteFormDialogComponent, { data });
    }

    private getMermaDialogRef(
      item: Movimiento,
      afectado: AfectadoEnum
    ): MatDialogRef<MovimientoEditByMermaFormDialogComponent> {
      const data: MovimientoMermaEditFormDialogData = {
        afectado,
        item,
      };
      return this.dialog.open(MovimientoEditByMermaFormDialogComponent, { data });
    }

    private getList(): void {

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

          /*data.forEach(element =>{
            /*element.detalleMovimiento = (
              (element.tipo_movimiento_descripcion === 'Anticipo') ? element.anticipo?.concepto
                : (element.tipo_movimiento_descripcion === 'Descuento' ) ? element.descuento_concepto
                : (element.tipo_movimiento_descripcion === 'Complemento' ) ? element.complemento_concepto : element.tipo_movimiento_descripcion
            )

            element.movimiento_saldo = (element.pendiente + element.confirmado + element.finalizado);

          })*/

          let acumulado = 0;
          let firsPendiente = false;
          data.reverse().forEach(element =>{

            if (!firsPendiente && element.estado === 'Pendiente'){
              acumulado = 0;
              firsPendiente=true;
            }
            acumulado = acumulado + (element.pendiente + element.confirmado + element.finalizado);
            element.movimiento_saldo = acumulado ;

          });

          data.reverse();

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

