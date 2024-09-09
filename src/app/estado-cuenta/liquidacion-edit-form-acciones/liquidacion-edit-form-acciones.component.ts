import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ComentarioConfirmDialogComponent } from 'src/app/dialogs/comentario-confirm-dialog/comentario-confirm-dialog.component';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { changeLiquidacionStatusData } from 'src/app/form-data/liquidacion';
import { Liquidacion } from 'src/app/interfaces/liquidacion';
import { DialogService } from 'src/app/services/dialog.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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

  @Output() liquidacionChange = new EventEmitter();
  @Output() liquidacionSometerChange = new EventEmitter();

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
        this.router.navigate([`/estado-cuenta/${m.ESTADO_CUENTA}/${a.LISTAR}`]);
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
    const message = `Está seguro que desea Pasar a Revisión la Liquidación Nº ${this.id}`;
    this.dialogService.configDialogRef(
      this.dialog.open(ComentarioConfirmDialogComponent, {
        data: {
          message,
        },
      }),
      (comentario: string) => {
        this.liquidacionService
          .someter(this.id, changeLiquidacionStatusData(comentario))
          .subscribe((rest) => {
            this.snackbar.changeStatus();
            this.liquidacionSometerChange.emit(rest);
          });
      },
      (val?: string | boolean) => val !== false
    );
  }
}
