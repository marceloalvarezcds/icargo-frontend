import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { filter } from 'rxjs/operators';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { mockEstadoCuentaList } from 'src/app/interfaces/estado-cuenta';
import { Instrumento } from 'src/app/interfaces/instrumento';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReportsService } from 'src/app/services/reports.service';
import { getQueryParams, getQueryParamsPDV } from 'src/app/utils/contraparte-info';
import { LiquidacionEditFieldsComponent } from '../liquidacion-edit-fields/liquidacion-edit-fields.component';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-liquidacion-edit-form',
  templateUrl: './liquidacion-edit-form.component.html',
  styleUrls: ['./liquidacion-edit-form.component.scss'],
})
export class LiquidacionEditFormComponent implements OnInit {

  E = LiquidacionEstadoEnum;
  m = m;
  form = new FormGroup({});
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/list-detalle/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  @Input() id?: number;
  item?: Liquidacion;
  @Input() isEdit = false;
  movimientos: Movimiento[] = [];
  actual_contraparte = '';
  actual_contraparte_numero_documento = '';
  pdv=0;
  flujo = '';
  saldo = 0;
  @Output() liquidacionChange = new EventEmitter();

  estadoCuenta= mockEstadoCuentaList[0];

  @ViewChild('child')
  childEdit!: LiquidacionEditFieldsComponent;

  get gestorCargaId(): number | undefined {
    return this.item?.gestor_carga_id;
  }

  get isShow(): boolean {
    return !this.isEdit;
  }

  get comentario(): string {
    return this.item?.comentarios ?? '';
  }

  get esFinalizado(): boolean {
    return this.item?.etapa === LiquidacionEtapaEnum.FINALIZADO;
  }

  get etapa(): LiquidacionEtapaEnum {
    return this.esFinalizado
      ? LiquidacionEtapaEnum.FINALIZADO
      : LiquidacionEtapaEnum.EN_PROCESO;
  }

  get instrumentos(): Instrumento[] {
    return this.item?.instrumentos ?? [];
  }

  get contraparte_id():number{
    const contraparteId = this.item?.chofer_id ?? this.item?.propietario_id ?? this.item?.proveedor_id ?? this.item?.remitente_id;

    if (contraparteId) return contraparteId

    return 0;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private estadoCuentaService: EstadoCuentaService,
    private reportsService: ReportsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(): void {
    const contraparte = this.actual_contraparte;
    const contraparte_numero_documento = this.actual_contraparte_numero_documento;
    // obtener info pdv
    // obtener info linea
    if (this.pdv){
      this.backUrl = '/estado-cuenta/punto_venta/detallado/listar';
      this.router.navigate([this.backUrl],
        { queryParams:getQueryParamsPDV!(this.estadoCuenta!) }
      );
    } else {
      this.router.navigate([this.backUrl], {
        queryParams: getQueryParams(
          {
            ...this.item!,
            contraparte_id: this.contraparte_id,
            contraparte: contraparte,
            contraparte_numero_documento: contraparte_numero_documento,
          },
          this.item!.etapa
        ),
      });
    }
  }

  changeMovimientoList(): void {
    this.loadLiquidacion();
  }

  downloadFile(): void {
    this.movimientoService
      .generateReportsByEstadoAndLiquidacionId(this.etapa, this.id!)
      .subscribe((filename) => {
        this.reportsService.downloadFile(filename).subscribe((file) => {
          saveAs(file, filename);
        });
      });
  }

  actualizar(): void {

    if (this.childEdit.movimientos.length===0) {
      this.editLiquidacion();
      return;
    }
    /*
    let es_pago_cobro = (this.childEdit.saldoMovimientoLiquidacion >= 0) ? 'PAGO' : 'COBRO';
    let pago_cobro = es_pago_cobro === 'PAGO' ? this.childEdit.monto_pc.value : (this.childEdit.monto_pc.value*-1);

    const data: LiquidacionConfirmDialogData = {
      contraparteInfo: this.estadoCuenta!,
      list: this.childEdit.movimientos,
      credito: this.childEdit.credito,
      debito: this.childEdit.debito,
      monto: pago_cobro,
      saldo: this.childEdit.childSaldoView.saldo,

    };
    this.dialog
      .open(LiquidacionConfirmDialogComponent, {
        data,
        panelClass: 'full-dialog',
      })
      .afterClosed()
      .pipe(filter((confirmed) => !!confirmed))
      .subscribe(() => {
        this.editLiquidacion();
      });
      */
  }

  editLiquidacion():void {
    this.childEdit.modificarLiquidacion()
  }

  redirectToEdit(): void {
      const id = this.id!;
      this.router.navigate(
        [`/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.EDITAR}/${id}`],
        {
          queryParams: {
            backUrl: `/estado-cuenta/${m.ESTADO_CUENTA}/${m.LIQUIDACION}/${a.VER}/${id}`,
            contraparte_id: this.contraparte_id,
            actual_contraparte: this.actual_contraparte,
            actual_contraparte_numero_documento:
              this.actual_contraparte_numero_documento,
          },
        }
      );
  }

  private getData(): void {
    const {
      backUrl,
      contraparte_id,
      actual_contraparte,
      actual_contraparte_numero_documento,
      punto_venta,
      flujo,
    } = this.route.snapshot.queryParams;

    this.id = +this.route.snapshot.params.id;

    this.actual_contraparte = actual_contraparte;
    this.actual_contraparte_numero_documento = actual_contraparte_numero_documento;
    this.isEdit = /edit/.test(this.router.url);
    this.flujo = flujo;
    this.pdv = punto_venta;

    if (backUrl) {
      this.backUrl = backUrl;
    }

    this.loadLiquidacion();
  }

  loadLiquidacionOnly(): void {
    this.liquidacionService.getById(this.id!).subscribe((item) => {

      this.item = item;
      this.actual_contraparte = this.item.contraparte;
      this.actual_contraparte_numero_documento = this.item.contraparte_numero_documento;
      this.estadoCuenta.contraparte = this.item.contraparte;
      this.estadoCuenta.contraparte_numero_documento = this.item.contraparte_numero_documento;
      this.estadoCuenta.tipo_contraparte_descripcion = this.item.tipo_contraparte.descripcion
    });
  }

  loadLiquidacion(): void {
    this.liquidacionService.getById(this.id!).subscribe((item) => {
      this.item = item;
      this.actual_contraparte = this.item.contraparte;
      this.actual_contraparte_numero_documento = this.item.contraparte_numero_documento;
      this.estadoCuenta.contraparte = this.item.contraparte;
      this.estadoCuenta.contraparte_numero_documento = this.item.contraparte_numero_documento;
      this.estadoCuenta.tipo_contraparte_descripcion = this.item.tipo_contraparte.descripcion
      this.getList(item);
      this.getEstadoCuenta(item)
    });
  }

  getList(liq: Liquidacion): void {
    this.movimientoService
      .getListByLiquidacion(liq, liq.etapa ?? this.etapa)
      .subscribe((data) => {
        this.movimientos = data;
        //this.getEstadoCuenta(liq)
      });
  }

  getEstadoCuenta(liq: Liquidacion):void {

    const contraparteId = liq.chofer_id ?? liq.propietario_id ?? liq.proveedor_id ?? liq.remitente_id;

    if (this.pdv) {

      this.estadoCuentaService
        .getListByPDVContraparte(
          contraparteId!,
          liq.contraparte,
          liq.contraparte_numero_documento,
          liq.punto_venta_id!,
          this.flujo,
        )
        .pipe(filter((e) => !!e))
        .subscribe((estadoCuenta) => {
          this.estadoCuenta = estadoCuenta!;
        });

    } else {
      this.estadoCuentaService
        .getByContraparte(
          liq.tipo_contraparte_id,
          contraparteId!,
          liq.contraparte,
          liq.contraparte_numero_documento,
          liq.punto_venta_id
        )
        .pipe(filter((e) => !!e))
        .subscribe((estadoCuenta) => {
          this.estadoCuenta = estadoCuenta!;
      });
    }

  }

  someterLiquidacionFinish(liquidacion:any) {
    this.item = liquidacion;
    this.liquidacionChange.emit(liquidacion);
  }

}
