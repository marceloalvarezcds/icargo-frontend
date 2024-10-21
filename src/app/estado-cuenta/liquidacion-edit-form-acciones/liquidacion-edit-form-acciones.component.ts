import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { DialogService } from 'src/app/services/dialog.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

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

  @Input() isShow = false;
  @Input() liquidacion!: Liquidacion;
  @Input() monto : number | undefined = 0;
  @Input() saldoMovimiento : number | undefined = 0;

  @Output() liquidacionChange = new EventEmitter();
  @Output() liquidacionFlujoChange = new EventEmitter();
  @Output() liquidacionFacturaChange = new EventEmitter();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackbar: SnackbarService,
    private liquidacionService: LiquidacionService,
    private reportsService: ReportsService
  ) {}

  downloadPDF(): void {
    this.liquidacionService.pdf(this.id!, this.etapa).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  aceptar(): void {
    const message = `Está seguro que desea Aceptar la Liquidación Nº ${this.id}`;
    this.dialogService.changeStatusConfirm(
      message,
      this.liquidacionService.aceptar(this.id),
      () => {
        //this.router.navigate([`/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`]);
        this.liquidacionFlujoChange.emit();
      }
    );
  }

  cancelar(): void {
    const message = `Está seguro que desea Cancelar la Liquidación Nº ${this.id}`;
    this.dialogService.changeStatusConfirm(
      message,
      this.liquidacionService.cancelar(this.id),
      () => {
        this.router.navigate([`/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`]);
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

    let es_pago_cobro = (this.saldoMovimiento! > 0) ? 'PAGO' : 'COBRO';
    let pago_cobro = es_pago_cobro === 'PAGO' ? Math.abs(this.monto!) : Math.abs(this.monto!)*-1 ;

    const message = `Está seguro que desea Pasar a Revisión la Liquidación Nº ${this.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: true,
        },
      }),
      (comentario: string) => {
        let form = { 'monto': pago_cobro, comentario }

        this.liquidacionService
          .someter(this.id, changeLiquidacionDataMonto(form))
          .subscribe((rest) => {
            this.snackbar.changeStatus();
            this.liquidacionFlujoChange.emit(rest);
          });
      },
      //(val?: string | boolean) => val !== false
    );
  }

  private emitChange(): void {
    this.snackbar.open('Factura agregada');
    this.liquidacionFacturaChange.emit();
    this.liquidacionChange.emit();
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
      valor_operacion: this.liquidacion.pago_cobro,
      contribuyente: this.liquidacion.contraparte,
      ruc: this.liquidacion.contraparte_numero_documento,
      item,
    };

    return this.dialog.open(FacturaFormDialogComponent, { data, panelClass: 'half-dialog', }, );
  }

}
