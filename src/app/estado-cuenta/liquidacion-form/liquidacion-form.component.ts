import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LiquidacionConfirmDialogComponent } from 'src/app/dialogs/liquidacion-confirm-dialog/liquidacion-confirm-dialog.component';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { createLiquidacionData } from 'src/app/form-data/liquidacion-movimiento';
import { EstadoCuenta } from 'src/app/interfaces/estado-cuenta';
import { LiquidacionConfirmDialogData } from 'src/app/interfaces/liquidacion-confirm-dialog-data';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { EstadoCuentaService } from 'src/app/services/estado-cuenta.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-liquidacion-form',
  templateUrl: './liquidacion-form.component.html',
  styleUrls: ['./liquidacion-form.component.scss'],
})
export class LiquidacionFormComponent implements OnInit {
  form = new FormGroup({});
  backUrl = `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`;
  modelo = m.LIQUIDACION;
  etapa?: LiquidacionEtapaEnum;
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
    return this.credito - this.debito;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private estadoCuentaService: EstadoCuentaService,
    private liquidacionService: LiquidacionService,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  back(save: boolean): void {
    if (save) {
      this.submit(save);
    } else {
      this.router.navigate([this.backUrl]);
    }
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
          if (confirmed) {
            this.router.navigate([this.backUrl]);
          } else {
            this.getData();
          }
          this.movimientosSelected.splice(0, this.movimientosSelected.length);
        });
    } else {
      this.snackbar.open('Debe elegir al menos 1 movimiento');
    }
  }

  private getData(): void {
    const {
      backUrl,
      etapa,
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
        contraparte,
        contraparte_numero_documento
      )
      .pipe(filter((e) => !!e))
      .subscribe((estadoCuenta) => {
        this.estadoCuenta = estadoCuenta!;
        this.getList();
      });
  }

  getList(): void {
    const etapa = this.etapa! as LiquidacionEtapaEnum;
    this.movimientoService
      .getListByEstadoCuenta(this.estadoCuenta!, etapa)
      .subscribe((data) => {
        this.list = data;
        this.movimientosSelected = [];
      });
  }
}
