import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter, map } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { DialogService } from 'src/app/services/dialog.service';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { LiquidacionFormFieldsComponent } from '../liquidacion-form-fields/liquidacion-form-fields.component';
import { getQueryParams, getQueryParamsPDV } from 'src/app/utils/contraparte-info';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UserService } from 'src/app/services/user.service';
import { MonedaService } from 'src/app/services/moneda.service';
import { Moneda, mockMoneda1 } from 'src/app/interfaces/moneda';

@Component({
  selector: 'app-liquidacion-form',
  templateUrl: './liquidacion-form.component.html',
  styleUrls: ['./liquidacion-form.component.scss'],
})
export class LiquidacionFormComponent implements OnInit {

  m = m;
  form = new FormGroup({});
  backUrl = `/estado-cuenta/estado_cuenta/list-detalle/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  etapa?: LiquidacionEtapaEnum;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];
  moneda?:Moneda = mockMoneda1;

  @Input() data? : ContraparteInfoMovimientoLiq;

  @Output() createdLiquidacion: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('child') child!: LiquidacionFormFieldsComponent;

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get saldo(): number {
    return subtract(this.credito, this.debito);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private monedaService: MonedaService,
    private reportsService: ReportsService,
    private dialogService: DialogService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(save: boolean): void {
    let { es_pdv } = this.route.snapshot.queryParams;

    if (save) {
      this.submit(save);
    } else {
      if (coerceBooleanProperty(es_pdv)) {
        this.backUrl = '/estado-cuenta/punto_venta/detallado/listar';

        this.router.navigate([this.backUrl],
          { queryParams:getQueryParamsPDV!(this.estadoCuenta!) }
        );
      } else {
        this.router.navigate([this.backUrl],
          { queryParams:getQueryParams!(this.estadoCuenta!) }
        );
      }
    }
  }

  confirm(): void {
    if (!this.child.validateForm()){
      this.snackbar.open('Verifique campos!');
      return;
    } else {

      if (this.child.movimientosSelected.length <= 0) {
        this.snackbar.open('Debe elegir al menos 1 movimiento');
        return;
      }

      this.prepareSend();
    }
  }

  groupBy( column:string, data: any[] ){

    if(!column) return data;

    const customReducer = (accumulator:any, currentValue:any) => {
      let currentGroup = currentValue[column];
      if(!accumulator[currentGroup])
      accumulator[currentGroup] = [{
        groupName: `Moneda: ${currentValue[column]}`,
        totales: 0,
        isGroup: true,
      }];

      accumulator[currentGroup][0] =
        {
          ...accumulator[currentGroup][0],
          totales:accumulator[currentGroup][0].totales + currentValue.monto
        };

      accumulator[currentGroup].push(currentValue);

      return accumulator;
    }

    let groups = data.reduce(customReducer,{});
    let groupArray = Object.keys(groups).map(key => groups[key]);
    let flatList = groupArray.reduce((a,c)=>{return a.concat(c); },[]);

    return flatList;
  }

  prepareSend(): void {
    //if (this.movimientosSelected.length) {

    const listMovimientos = this.child.movimientosSelected.slice();
    // agrupamos por moneda
    const listMovimientosGrouped = this.groupBy('moneda_nombre', listMovimientos);

    console.log("movs agrupados: ",listMovimientosGrouped);

      const data: LiquidacionConfirmDialogData = {
        contraparteInfo: this.estadoCuenta!,
        list: listMovimientosGrouped,
        credito: this.child.credito,
        debito: this.child.debito,
        monto: this.child.monto,
        saldo: this.child.monto,
        totalMonedas: this.child.totalMonedas
      };
      this.dialog
        .open(LiquidacionConfirmDialogComponent, {
          data,
          panelClass: 'full-dialog',
        })
        .afterClosed()
        .pipe(filter((confirmed) => !!confirmed))
        .subscribe(() => {
          this.submit(false);
        });
    //} else {
    //  this.snackbar.open('Debe elegir al menos 1 movimiento');
    //}
  }

  downloadFile(): void {
    this.movimientoService
      .generateReportsByContraparte(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        this.etapa!
      )
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  onCreateLiquidacion(liquidacion:Liquidacion): void {

    const gestorCargaId = liquidacion.gestor_carga_id;

    if ( this.userService.checkPermisoAndGestorCargaId(
      a.PASAR_A_REVISION,
      this.modelo,
      gestorCargaId)
    ) {
      const nav = '/estado-cuenta/estado_cuenta/liquidacion/editar/'+liquidacion.id;
      this.router.navigate([nav]);
      return;
    }

    this.getData();
  }

  private submit(confirmed: boolean): void {
    this.child.sendLiquidacion(confirmed);
  }

  private getData(): void {

    let {
      backUrl,
      etapa,
      contraparte_id,
      contraparte,
      contraparte_numero_documento,
      tipo_contraparte_id,
      punto_venta_id,
      es_pdv,
      flujo
    } = this.route.snapshot.queryParams;

    if (backUrl) {
      this.backUrl = backUrl;
    }

    this.etapa = etapa;

    /*if (!!this.data){
      this.etapa = this.data.etapa as LiquidacionEtapaEnum;
      contraparte_id = this.data.contraparte_id;
      contraparte = this.data.contraparte;
      contraparte_numero_documento = this.data.contraparte_numero_documento;
      tipo_contraparte_id = this.data.tipo_contraparte_id;
    }*/

    if (es_pdv) {

      this.estadoCuentaService
        .getListByPDVContraparte(
          contraparte_id,
          contraparte,
          contraparte_numero_documento,
          punto_venta_id,
          flujo,
        )
        //.pipe(filter((e) => !!e))
        .subscribe((estadoCuenta) => {
          this.estadoCuenta = estadoCuenta ?? undefined;
          this.getListPDV(contraparte_id, punto_venta_id, flujo);
        });

    } else {

      this.estadoCuentaService
      .getByContraparte(
        tipo_contraparte_id,
        contraparte_id,
        contraparte,
        contraparte_numero_documento
      )
      //.pipe(filter((e) => !!e))
      .subscribe((estadoCuenta) => {
        this.estadoCuenta = estadoCuenta ?? undefined;
        this.getList(flujo);
      });

    }

  }

  getList(flujo:string): void {

    if (this.estadoCuenta!.es_pdv && !flujo) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    const etapa = this.etapa! as LiquidacionEtapaEnum;

    this.movimientoService
    .getListByEstadoCuenta(
      this.estadoCuenta!,
      this.estadoCuenta!.contraparte_id,
      etapa
    )
    .pipe(
      map((response:Movimiento[]) => {
        response.forEach(r=> r.isExpanded= false);
        return response;
      })
    )
    .subscribe((data) => {
      this.list = data;
      console.log("movimientos: ", data);
      this.movimientosSelected = [];
    });
  }

  getListPDV(contraparte_id:number, punto_venta_id:number, flujo:string): void {

    if (this.estadoCuenta!.es_pdv && !flujo) {
      this.list = [];
      this.movimientosSelected = [];
      return;
    }

    const etapa = this.etapa! as LiquidacionEtapaEnum;

      this.movimientoService
        .getListByEstadoCuenta(
          this.estadoCuenta!,
          contraparte_id,
          etapa,
          punto_venta_id,
          flujo
        )
        .pipe(
          map((response:Movimiento[]) => {
            response.forEach(r=> r.isExpanded= false);
            return response;
          })
        )
        .subscribe((data) => {
          this.list = data;
          this.movimientosSelected = [];
       });

  }

}
