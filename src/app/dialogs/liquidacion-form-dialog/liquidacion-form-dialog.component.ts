import { Component, Inject } from '@angular/core';
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
import { createLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { ContraparteInfoMovimiento, ContraparteInfoMovimientoLiq } from 'src/app/interfaces/contraparte-info';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
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

  isNew = false;
  isEdit = false;

  get credito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.credito, 0);
  }

  get debito(): number {
    return this.movimientosSelected.reduce((acc, cur) => acc + cur.debito, 0);
  }

  get saldo(): number {
    return subtract(this.credito, this.debito);
  }

  get contraparteInfo(){
    return this.data;
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LiquidacionFormDialogComponent>,
    private snackbar: SnackbarService,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: ContraparteInfoMovimientoLiq
  ) {

    if(this.data.isNew) {
      this.isNew = true;
      this.data.etapa = LiquidacionEtapaEnum.PENDIENTE;
    }

    this.getData();
  }

  createdLiquidacion(liquidacion:any): void {
    this.liquidacionId = liquidacion.id;
    this.isNew = false;
  }

  confirm(): void {
    if (this.movimientosSelected.length) {
      const data: LiquidacionConfirmDialogData = {
        contraparteInfo: this.estadoCuenta!,
        list: this.movimientosSelected.slice(),
        credito: this.credito,
        debito: this.debito,
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
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento');
    }
  }

  private submit(confirmed: boolean): void {
    if (this.movimientosSelected.length) {
      this.liquidacionService
        .create(createLiquidacionData(this.movimientosSelected))
        .subscribe((response) => {
          this.snackbar.open('Datos guardados satisfactoriamente');
          console.log("response: ", response);
          this.liquidacionId = response.id ;
          this.isEdit = true;
          console.log("this.liquidacionId: ", this.liquidacionId);
        });
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento');
    }
  }

  cerrarLiquidacion(liquidacion:any): void {

    if (liquidacion.estado === LiquidacionEstadoEnum.PENDIENTE){
      this.close();
    }

  }

  private close(): void {
    this.dialogRef.close(true);
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
        this.data.contraparte_numero_documento
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
        this.etapa
      )
      .subscribe((data) => {
        this.list = data;
        this.movimientosSelected = [];
      });
  }

}
