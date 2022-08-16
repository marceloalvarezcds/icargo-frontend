import { Component, EventEmitter, Input, Output } from '@angular/core';
import { saveAs } from 'file-saver';
import { EstadoEnum } from 'src/app/enums/estado-enum';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { DialogService } from 'src/app/services/dialog.service';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { ReportsService } from 'src/app/services/reports.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-orden-carga-edit-form-acciones',
  templateUrl: './orden-carga-edit-form-acciones.component.html',
  styleUrls: ['./orden-carga-edit-form-acciones.component.scss'],
})
export class OrdenCargaEditFormAccionesComponent {
  E = EstadoEnum;
  @Input() oc?: OrdenCarga;
  @Input() isAnticiposLiberados = false;
  @Input() isShow = false;
  @Input() hasChange = false;
  @Input() puedeConciliar = false;

  @Output() ocChange = new EventEmitter<void>();

  get placaCamionSemi(): string {
    return this.oc ? `${this.oc.camion_placa}/${this.oc.semi_placa}` : '';
  }

  constructor(
    private ordenCargaService: OrdenCargaService,
    private reportsService: ReportsService,
    private snackbar: SnackbarService,
    private dialog: DialogService
  ) {}

  aceptar(): void {
    this.dialog.confirmation(
      '¿Está seguro que desea aceptar la Orden de Carga?',
      () => {
        this.ordenCargaService.aceptar(this.oc!.id).subscribe(() => {
          this.snackbar.open('Estado cambiado satisfactoriamente');
          this.ocChange.emit();
        });
      }
    );
  }

  cancelar(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea cancelar la Orden de Carga?',
      this.ordenCargaService.cancelar(this.oc!.id),
      () => {
        this.ocChange.emit();
      }
    );
  }

  conciliar(): void {
    if (!this.hasChange) {
      this.dialog.changeStatusConfirm(
        '¿Está seguro que desea conciliar la Orden de Carga?',
        this.ordenCargaService.conciliar(this.oc!.id),
        () => {
          this.ocChange.emit();
        }
      );
    } else {
      this.snackbar.open('Por favor guardar los cambios antes de conciliar');
    }
  }

  finalizar(): void {
    this.dialog.changeStatusConfirm(
      '¿Está seguro que desea finalizar la Orden de Carga?',
      this.ordenCargaService.finalizar(this.oc!.id),
      () => {
        this.ocChange.emit();
      }
    );
  }

  modificarAnticipos(): void {
    this.dialog.changeStatusConfirm(
      `¿Está seguro que desea ${
        this.isAnticiposLiberados ? 'bloquear' : 'liberar'
      } anticipos?`,
      this.ordenCargaService.modificarAnticipos(this.oc!.id),
      (x) => {
        this.ocChange.emit();
      }
    );
  }

  downloadPDF(): void {
    this.ordenCargaService.pdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }

  downloadResumenPDF(): void {
    this.ordenCargaService.resumenPdf(this.oc!.id).subscribe((filename) => {
      this.reportsService.downloadFile(filename).subscribe((file) => {
        saveAs(file, filename);
      });
    });
  }
}
