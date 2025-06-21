import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ComentarioConfirmDialogComponent } from 'src/app/dialogs/comentario-confirm-dialog/comentario-confirm-dialog.component';
import { FacturaFormDialogComponent } from 'src/app/dialogs/factura-form-dialog/factura-form-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { changeLiquidacionDataMonto, changeLiquidacionStatusData } from 'src/app/form-data/liquidacion';
import { Factura } from 'src/app/interfaces/factura';
import { FacturaFormDialogData } from 'src/app/interfaces/factura-form-dialog-data';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorService } from 'src/app/services/http-error.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';
import { create } from 'src/app/utils/table-event-crud';
import { numberWithCommas } from 'src/app/utils/thousands-separator';

@Component({
  selector: 'app-liquidacion-edit-form-acciones',
  templateUrl: './liquidacion-edit-form-acciones.component.html',
  styleUrls: ['./liquidacion-edit-form-acciones.component.scss'],
})
export class LiquidacionEditFormAccionesComponent {
  a = a;
  m = m;
  E = LiquidacionEstadoEnum;

  get id(): number {
    return this.liquidacion.id;
  }

  get esFinalizado(): boolean {
    return this.liquidacion?.etapa === LiquidacionEtapaEnum.FINALIZADO;
  }

  get etapa(): LiquidacionEtapaEnum {
    return this.esFinalizado
      ? LiquidacionEtapaEnum.FINALIZADO
      : LiquidacionEtapaEnum.EN_PROCESO;
  }

  get isFacturaReady():boolean {
    return this.liquidacion.facturas ? (this.liquidacion.facturas.length>0) : false;
  }

  get esPagoCobro():boolean {
    return (this.liquidacion.es_pago_cobro === 'PAGO');
  }

  @Input() isShow = false;
  @Input() liquidacion!: Liquidacion;
  //@Input() monto : number | undefined = 0;
  //@Input() saldoMovimiento : number | undefined = 0;
  @Input() totalMovimiento : number = 0;
  @Input() saldoCC!: number;
  //@Input() sentidoOp: boolean = false;
  //@Input() movimientos : Movimiento[] = [];
  @Input() form : FormGroup|undefined=undefined;

  @Output() liquidacionChange = new EventEmitter();
  @Output() liquidacionFlujoChange = new EventEmitter();
  @Output() liquidacionFacturaChange = new EventEmitter<Factura>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackbar: SnackbarService,
    private liquidacionService: LiquidacionService,
    private reportsService: ReportsService,
    private httpErrorService: HttpErrorService,
  ) {}

  downloadPDF(): void {
    this.liquidacionService.pdf(this.id!, this.etapa).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  aceptar(): void {

    if (this.isFacturaReady) {
      const factura = this.liquidacion.facturas[0];
      if (!factura.foto) {

        this.httpErrorService.setErrorList([
          `No se ha cargado la foto de la factura ${factura.numero_factura}`,
        ]);

        return;
      }
    }

    const message = `Está seguro que desea Aceptar la Liquidación Nº ${this.id}`;

    let htmlFooter = `<div class="row mb-1">`;

    if (this.liquidacion.es_orden_pago) {
      const montoPC = this.form?.get('monto_pc')?.value;

      htmlFooter = htmlFooter + `
        <div class="col-xs-12">
            <div class="row alerta">
              <strong class="col-xs-7">${ this.esPagoCobro ? "Monto Pagar" :"Monto Cobrar"}</strong>
              <strong class="col-xs-5">${numberWithCommas(Math.abs(montoPC))}</strong>
            </div>
          </div>
      `;
    } else {
      htmlFooter = htmlFooter + `
        <div class="col-xs-12">
          <div class="row alerta">
            <span class="col-xs-7">Total en esta Liquidación</span>
            <span class="col-xs-5">${numberWithCommas(this.totalMovimiento)}</span>
            <span class="col-xs-7">Sentido Operación</span>
            <strong class="col-xs-5">${ this.esPagoCobro ? "A Pagar" :"A Cobrar"}</strong>
          </div>
        </div>
      `;
    }

    htmlFooter = htmlFooter + `
        <div class="col-xs-12 color-white"> <span>abc</span> </div>

        <div class="col-xs-12">
          <div class="row alerta">
            <span class="col-xs-7">Total en Cuenta Corriente</span>
            <span class="col-xs-5">${numberWithCommas(this.saldoCC)}</span>
          </div>
        </div>
      </div>

      <br>
      <br>
      <div class="fondo-gris">
        <h4 class="alerta">
          <span>Atencion!!</span>
          Al aceptar la liquidacion se podra proceder al desembolso.
        </h4>
      <div>
    </div>
    `;

    this.dialogService.changeStatusConfirmHtml(
      message,
      htmlFooter,
      this.liquidacionService.aceptar(this.id),
      (resp) => {
        //this.router.navigate([`/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`]);
        this.liquidacionFlujoChange.emit(resp);
      },
      'large-dialog'
    );
  }

  preCancelar(){
    if (this.isFacturaReady) {
      this.httpErrorService.setErrorList([
        `No se puede cancelar liquidacion con factura`,
      ]);
      return;
    }

    if (this.liquidacion.instrumentos && this.liquidacion.instrumentos.length>0) {
      this.httpErrorService.setErrorList([
        `No se puede cancelar liquidacion con instrumentos`,
      ]);
      return;
    }

    this.cancelar();
  }

  cancelar(): void {
    const message = `Está seguro que desea Cancelar la Liquidación Nº ${this.id}`;
    this.dialogService.changeStatusConfirm(
      message,
      this.liquidacionService.cancelar(this.id),
      () => {
        this.snackbar.changeStatus();
        this.liquidacionFlujoChange.emit(this.liquidacion);
      }
    );
  }

  rechazar(): void {
    const message = `Está seguro que desea Rechazar la Liquidación Nº ${this.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: true,
        },
      }),
      (comentario: string) => {
        this.liquidacionService
          .rechazar(this.id, changeLiquidacionStatusData(comentario))
          .subscribe(() => {
            this.snackbar.changeStatus();
            this.liquidacionChange.emit();
          });
      }
    );
  }

  pasarARevision(): void {
    const message = `Está seguro que desea Pasar a Revisión la Liquidación Nº ${this.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
        },
      }),
      (comentario: string) => {
        this.liquidacionService
          .pasarARevision(this.id, changeLiquidacionStatusData(comentario))
          .subscribe(() => {
            this.snackbar.changeStatus();
            this.liquidacionChange.emit();
          });
      },
      (val?: string | boolean) => val !== false
    );
  }

  someter(): void {

    this.form!.markAsDirty();
    this.form!.markAllAsTouched();

    console.log("this.form: ", this.form);
    if ( this.liquidacion.es_orden_pago && !this.form!.valid) {
      return;
    }

    //let es_pago_cobro = (this.saldoMovimiento! >= 0) ? 'PAGO' : 'COBRO';
    //let pago_cobro = es_pago_cobro === 'PAGO' ? Math.abs(this.monto!) : Math.abs(this.monto!)*-1 ;
    /*if ( !this.sentidoOp ) {
      pago_cobro = Math.abs(pago_cobro)*-1;
      es_pago_cobro='COBRO';
    } else {
      pago_cobro = Math.abs(pago_cobro);
      es_pago_cobro='PAGO';
    }*/
    if (this.liquidacion.es_orden_pago) {

      const liq = this.form?.getRawValue();
      const form = { 'monto': (liq.monto_pc ?? this.liquidacion.pago_cobro), comentario:"" };

      this.liquidacionService
        .someter(this.id, changeLiquidacionDataMonto(form))
        .subscribe((rest) => {
          this.snackbar.changeStatus();
          this.liquidacionFlujoChange.emit(rest);
        });
      return;
    }

    const message = `Está seguro que desea Pasar a Revisión la Liquidación Nº ${this.id}`;
    let htmlContent = '';
    let htmlFooter = `<div class="row mb-1">

      <div class="col-xs-12">
        <div class="row alerta">
          <span class="col-xs-7">Total en esta Liquidación</span>
          <span class="col-xs-5">${numberWithCommas(this.totalMovimiento)}</span>
          <span class="col-xs-7">Sentido Operación</span>
          <strong class="col-xs-5">${ this.esPagoCobro ? "A Pagar" :"A Cobrar"}</strong>
        </div>
      </div>

      <div class="col-xs-12 color-white"> <span>abc</span> </div>

      <div class="col-xs-12">
        <div class="row alerta">
          <span class="col-xs-7">Total en Cuenta Corriente</span>
          <span class="col-xs-5">${numberWithCommas(this.saldoCC)}</span>
          es_pago_cobro
        </div>
      </div>

      <div class="col-xs-12">
      <div class="row alerta">
        <span class="col-xs-7">Sentido</span>
        <span class="col-xs-5">${this.esPagoCobro}</span>
        es_pago_cobro
      </div>
    </div>

    </div>`;

    if (!this.isFacturaReady) {
      htmlContent += `
        <div class="formulario-center">
          <h2 class="alerta">
            <span class="material-icons">warning</span>
            Atencion!! La liquidacion no tiene datos fiscales.
          </h2>
        <div>`;
    }

    /*if ( this.totalMovimiento != this.monto ) {
      htmlContent += `
        <div class="formulario-center">
          <span class="material-icons">warning</span>
          <h2 class="alerta">Atencion!! Monto Pago/Cobro es diferente a la sumatoria de los movimientos!</h2>
        <div>`;
    }*/

    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: false,
          htmlContent: htmlContent,
          htmlFooter: htmlFooter
        },
        panelClass: 'large-dialog'
      }),
      (comentario: string) => {
        const form = { 'monto': this.liquidacion.pago_cobro!, comentario }

        this.liquidacionService
          .someter(this.id, changeLiquidacionDataMonto(form))
          .subscribe((rest) => {
            this.snackbar.changeStatus();
            this.liquidacionFlujoChange.emit(rest);
          });
      },
      (val?: string | boolean | null ) => {
        return (val !== null && val !== false );
      }
    );
  }

  private emitChange(factura:Factura): void {
    console.log("factura: ", factura);
    this.snackbar.open('Factura agregada');
    this.liquidacionFacturaChange.emit(factura);
    //this.liquidacionChange.emit();
  }

  datosFiscalesForm(): void{
    create(this.getDialogRef(), this.emitChange.bind(this))
  }

  private getDialogRef(
    item?: Factura
  ): MatDialogRef<FacturaFormDialogComponent, Factura> {
    const contraparteId = this.liquidacion.chofer_id ?? this.liquidacion.propietario_id
      ?? this.liquidacion.proveedor_id ?? this.liquidacion.remitente_id;
    const data: FacturaFormDialogData = {
      liquidacion_id: this.liquidacion.id,
      contraparte_id: contraparteId!,
      tipo_contraparte_id: this.liquidacion.tipo_contraparte_id,
      valor_operacion: this.liquidacion.es_orden_pago
        ? Math.abs(this.liquidacion.pago_cobro!)
        : Math.abs(this.totalMovimiento),
      contribuyente: this.liquidacion.contraparte,
      ruc: this.liquidacion.contraparte_numero_documento,
      punto_venta_id: this.liquidacion.punto_venta_id,
      item,
    };

    return this.dialog.open(FacturaFormDialogComponent, { data, panelClass: 'factura-dialog', }, );
  }

}
