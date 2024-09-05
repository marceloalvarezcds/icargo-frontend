import { Component, Inject } from '@angular/core';
import { FormBuilder  } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { createLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { ContraparteInfoMovimiento } from 'src/app/interfaces/contraparte-info';
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

  form = this.fb.group({  })
  modelo = m.LIQUIDACION;
  etapa = LiquidacionEtapaEnum.PENDIENTE;
  estadoCuenta?: EstadoCuenta;
  list: Movimiento[] = [];
  movimientosSelected: Movimiento[] = [];

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
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LiquidacionFormDialogComponent>,
    private snackbar: SnackbarService,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: ContraparteInfoMovimiento
  ) {

    this.getData();
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
        .subscribe(() => {
          this.snackbar.open('Datos guardados satisfactoriamente');
          //this.close.bind(this)
          this.close();
        });
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento');
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
