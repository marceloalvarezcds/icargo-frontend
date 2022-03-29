import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComentarioConfirmDialogComponent } from 'src/app/dialogs/comentario-confirm-dialog/comentario-confirm-dialog.component';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { changeLiquidacionStatusData } from 'src/app/form-data/liquidacion';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import {
  changeStatusConfirm,
  configDialogRef,
} from 'src/app/utils/change-status';
import { changeStatusMessageSnackbar } from 'src/app/utils/snackbar';

@Component({
  selector: 'app-liquidacion-edit-form-acciones',
  templateUrl: './liquidacion-edit-form-acciones.component.html',
  styleUrls: ['./liquidacion-edit-form-acciones.component.scss'],
})
export class LiquidacionEditFormAccionesComponent {
  a = a;
  m = m;
  E = EstadoEnum;

  get id(): number {
    return this.liquidacion.id;
  }

  @Input() isShow = false;
  @Input() liquidacion!: Liquidacion;

  @Output() liquidacionChange = new EventEmitter();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private liquidacionService: LiquidacionService
  ) {}

  aceptar(): void {
    const message = `Está seguro que desea Aceptar la Liquidación Nº ${this.id}`;
    changeStatusConfirm(
      this.dialog,
      message,
      this.liquidacionService.aceptar(this.id),
      () =>
        changeStatusMessageSnackbar(this.snackbar, () => {
          this.router.navigate([
            `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`,
          ]);
        })
    );
  }

  cancelar(): void {
    const message = `Está seguro que desea Cancelar la Liquidación Nº ${this.id}`;
    changeStatusConfirm(
      this.dialog,
      message,
      this.liquidacionService.cancelar(this.id),
      () =>
        changeStatusMessageSnackbar(this.snackbar, () =>
          this.router.navigate([
            `/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`,
          ])
        )
    );
  }

  rechazar(): void {
    const message = `Está seguro que desea Rechazar la Liquidación Nº ${this.id}`;
    configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
          comentarioRequirido: true,
        },
      }),
      (comentario: string) => {
        this.liquidacionService
          .rechazar(this.id, changeLiquidacionStatusData(comentario))
          .subscribe(() =>
            changeStatusMessageSnackbar(this.snackbar, () =>
              this.liquidacionChange.emit()
            )
          );
      }
    );
  }

  pasarARevision(): void {
    const message = `Está seguro que desea Pasar a Revisión la Liquidación Nº ${this.id}`;
    configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
        },
      }),
      (comentario: string) => {
        this.liquidacionService
          .pasarARevision(this.id, changeLiquidacionStatusData(comentario))
          .subscribe(() =>
            changeStatusMessageSnackbar(this.snackbar, () =>
              this.liquidacionChange.emit()
            )
          );
      },
      (val?: string | boolean) => val !== false
    );
  }
}
