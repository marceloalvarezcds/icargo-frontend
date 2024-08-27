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
import { getQueryParams } from 'src/app/utils/contraparte-info';
import { getFilterList } from 'src/app/utils/filter';
import { createMovimiento } from 'src/app/utils/movimiento-utils';

type Filter = {
  tipo_contraparte_descripcion?: string;
  contraparte?: string;
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
      def: 'id',
      title: 'Nº de Movimiento',
      value: (element: Movimiento) => element.id,
      sticky: true,
    },
    {
      def: 'created_at',
      title: 'Fecha y hora',
      value: (element: Movimiento) => element.created_at,
      type: 'date',
    },
    {
      def: 'camion_placa',
      title: 'Chapa',
      value: (element: Movimiento) => element.camion_placa,
    },
    {
      def: 'cuenta_codigo_descripcion',
      title: 'Cuenta',
      value: (element: Movimiento) => element.cuenta_codigo_descripcion,
    },
    {
      def: 'concepto',
      title: 'Concepto',
      value: (element: Movimiento) => element.concepto,
    },
    {
      def: 'tipo',
      title: 'Tipo Operacion',
      value: (element: Movimiento) => 'ver HOY!',
    },
    {
      def: 'tipo_documento_relacionado_descripcion',
      title: 'Tipo de Doc Relacionado',
      value: (element: Movimiento) =>
        element.tipo_documento_relacionado_descripcion,
    },
    {
      def: 'numero_documento_relacionado',
      title: 'Nº Doc Relacionado',
      value: (element: Movimiento) => element.numero_documento_relacionado,
    },
    {
      def: 'detalle',
      title: 'Info',
      value: (element: Movimiento) => element.detalle,
    },
    {
      def: 'monto',
      title: 'Monto',
      value: (element: Movimiento) => element.monto,
      type: 'number',
    },
    {
      def: 'monto_ml',
      title: 'Monto (ML)',
      value: (element: Movimiento) => element.monto_ml,
      type: 'number',
    },
    {
      def: 'pendiente',
      title: LiquidacionEtapaEnum.PENDIENTE,
      value: (element: EstadoCuenta) => '0',
      type: 'number',
    },
    {
      def: 'confirmado',
      title: LiquidacionEtapaEnum.CONFIRMADO,
      value: (element: EstadoCuenta) => '0',
      type: 'number',
    },
    {
      def: 'finalizado',
      title: LiquidacionEtapaEnum.FINALIZADO,
      value: (element: EstadoCuenta) => '0',
      type: 'number',
    },
  ]

  etapa?: LiquidacionEtapaEnum;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];
  isFiltered = false;

  pendiente: number = 0;
  confirmado: number = 0;
  finalizado: number = 0;

  get credito(): number {
    return this.list.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.list.reduce((acc, cur) => acc + cur.debito, 0);
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

  @ViewChild('tipoContraparteCheckboxFilter')
  tipoContraparteCheckboxFilter!: CheckboxFilterComponent;
  @ViewChild('contraparteCheckboxFilter')
  contraparteCheckboxFilter!: CheckboxFilterComponent;

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
      this.estadoCuentaService.generateReports().subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
    }

    filterPredicate(obj: Movimiento, filterJson: string): boolean {
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

    calcularTotales(): void{

      this.list.forEach( (mov:Movimiento) => {
        /*mov.saldo = mov.pendiente + mov.confirmado + mov.finalizado;
        this.pendiente = this.pendiente + mov.pendiente;
        this.confirmado = this.confirmado + mov.confirmado;
        this.finalizado = this.finalizado + mov.finalizado;*/
      })

    }

    applyFilter(): void {
      let filter: Filter = {};
      this.isFiltered = false;

      /*this.tipoContraparteFiltered =
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
      );*/

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
        this.getMovList();
      });
    }

    createLiquidacion():void {

      let queryparam = getQueryParams(this.estadoCuenta!, LiquidacionEtapaEnum.FINALIZADO);

      console.log("queryparam");
      console.log(queryparam);

      this.router.navigate(
        [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.CREAR}`],
        {
          queryParams:getQueryParams(this.estadoCuenta!, LiquidacionEtapaEnum.PENDIENTE)
        }
      );

    }

    private getList(): void {

      const {
        backUrl,
        etapa,
        contraparte_id,
        contraparte,
        contraparte_numero_documento,
        tipo_contraparte_id,
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
            contraparte_numero_documento
          )
          .pipe(filter((e) => !!e))
          .subscribe((estadoCuenta) => {
            this.estadoCuenta = estadoCuenta!;
            console.log('respuesta: ', estadoCuenta);
            this.getMovList();
      });

    }

    getMovList(): void {
      const etapa = this.etapa! as LiquidacionEtapaEnum;

      console.log("this.estadoCuenta");
      console.log(!this.estadoCuenta);
      console.log(this.estadoCuenta);

      this.movimientoService
        .getListByEstadoCuentaDetalle(
          this.estadoCuenta!,
          this.estadoCuenta!.contraparte_id
        )
        .subscribe((data) => {
          this.list = data;
          this.movimientosSelected = [];

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
      //this.tipoContraparteFiltered = this.tipoContraparteFilterList.slice();
      //this.contraparteFiltered = this.contraparteFilterList.slice();
    }

    private redirectToCtaCteContraparte(mov: EstadoCuenta): void {


    }

}
