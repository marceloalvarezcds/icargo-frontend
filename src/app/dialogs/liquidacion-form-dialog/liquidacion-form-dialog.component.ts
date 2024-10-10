import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder  } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { LiquidacionEditFieldsComponent } from 'src/app/estado-cuenta/liquidacion-edit-fields/liquidacion-edit-fields.component';
import { LiquidacionFormFieldsComponent } from 'src/app/estado-cuenta/liquidacion-form-fields/liquidacion-form-fields.component';
import { createLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { ContraparteInfoMovimiento, ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { DialogService } from 'src/app/services/dialog.service';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { subtract } from 'src/app/utils/math';

@Component({
  selector: 'app-liquidacion-form-dialog',
  templateUrl: './liquidacion-form-dialog.component.html',
  styleUrls: ['./liquidacion-form-dialog.component.scss']
})
export class LiquidacionFormDialogComponent {

  modelo = m.LIQUIDACION;
  etapa = LiquidacionEtapaEnum.PENDIENTE;
  liquidacionId: number | undefined = undefined;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];
  liquidacion?:Liquidacion;
  isNew = false;
  isEdit = false;

  @ViewChild('child')
  child!: LiquidacionFormFieldsComponent;

  @ViewChild('childEdit')
  childEdit!: LiquidacionEditFieldsComponent;

  get contraparteInfo(){
    return this.data;
  }

  get esFinalizado():boolean {
    return (this.liquidacion?.estado === LiquidacionEstadoEnum.SALDO_ABIERTO ||
            this.liquidacion?.estado === LiquidacionEstadoEnum.SALDO_CERRADO);
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LiquidacionFormDialogComponent>,
    private snackbar: SnackbarService,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private dialogService: DialogService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {

    if(this.data.isNew) {

      this.isNew = true;
      this.data.etapa = LiquidacionEtapaEnum.PENDIENTE;
      this.getData();

    } else {

      this.getEstadoCuenta();
      this.liquidacionId = this.data.liquidacionId;
      this.isEdit = this.data.isEdit;
      this.etapa = this.data.etapa;
      this.loadLiquidacion();

    }

  }

  confirm(): void {
    if (this.child.movimientosSelected.length <= 0) {
      this.dialogService.confirmation(
        `Está seguro que desea Crear Liquidacións sin Movimientos`,
        () => {
          this.prepareSend();
        }
      );
      return;
    }

    this.prepareSend();
  }

  actualizar(): void {
    const data: LiquidacionConfirmDialogData = {
      contraparteInfo: this.estadoCuenta!,
      list: this.childEdit.movimientos,
      credito: this.childEdit.credito,
      debito: this.childEdit.debito,
      monto: this.childEdit.childSaldoView.monto,
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
        this.submitEdit();
      });
  }

  prepareSend(): void {
    //if (this.movimientosSelected.length) {
      const data: LiquidacionConfirmDialogData = {
        contraparteInfo: this.estadoCuenta!,
        list: this.child.movimientosSelected.slice(),
        credito: this.child.credito,
        debito: this.child.debito,
        monto: this.child.childSaldoView.monto,
        saldo: this.child.childSaldoView.saldo,
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

  private submit(confirmed: boolean): void {
    this.child.sendLiquidacion(confirmed)
  }

  private submitEdit():void {
    this.childEdit.modificarLiquidacion()
  }

  onCreateLiquidacion(liquidacion:any): void {
    this.liquidacionId = liquidacion.id;
    this.etapa = liquidacion.etapa;
    this.liquidacion = liquidacion;
    this.getMovimientos(liquidacion);
    this.isNew = false;
    this.isEdit = true;
  }

  cerrarLiquidacion(): void {
    this.close();
  }

  private close(): void {
    this.dialogRef.close(true);
  }

  private getEstadoCuenta(): void {
    this.estadoCuentaService
      .getByContraparte(
        this.data.tipo_contraparte_id,
        this.data.contraparte_id,
        this.data.contraparte,
        this.data.contraparte_numero_documento,
        this.data.punto_venta_id
      )
      .pipe(filter((e) => !!e))
      .subscribe((estadoCuenta) => {
        this.estadoCuenta = estadoCuenta!;
    });
  }

  private getData(): void {

    /*const {
      backUrl,
      contraparte_id,
      contraparte,
      contraparte_numero_documento,
      tipo_contraparte_id,
    } = this.route.snapshot.queryParams;

    if (backUrl) {
      this.backUrl = backUrl;
    }*/

    //this.isEdit = this.data ? true : false;

    this.estadoCuentaService
      .getByContraparte(
        this.data.tipo_contraparte_id,
        this.data.contraparte_id,
        this.data.contraparte,
        this.data.contraparte_numero_documento,
        this.data.punto_venta_id
      )
      .pipe(filter((e) => !!e))
      .subscribe((estadoCuenta) => {
        this.estadoCuenta = estadoCuenta!;
        this.getList();
      });

  }

  getList(): void {
    this.movimientoService
      .getListByEstadoCuenta(
        this.estadoCuenta!,
        this.estadoCuenta!.contraparte_id,
        this.etapa,
        this.estadoCuenta!.punto_venta_id
      )
      .subscribe((data) => {
        this.list = data;
        this.movimientosSelected = [];
      });
  }

  loadLiquidacion(): void {
    this.liquidacionService.getById(this.liquidacionId!).subscribe((item) => {
      this.liquidacion = item;
      this.getMovimientos(item);
    });
  }

  getMovimientos(liq: Liquidacion): void {
    this.movimientoService
      .getListByLiquidacion(liq, this.etapa)
      .subscribe((data) => {
        this.list = data;
      });
  }

}
