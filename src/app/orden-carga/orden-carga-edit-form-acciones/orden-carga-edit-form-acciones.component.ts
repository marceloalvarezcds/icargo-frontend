import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdenCarga } from 'src/app/interfaces/orden-carga';
import { OrdenCargaService } from 'src/app/services/orden-carga.service';
import { confirmationDialogToAceptar, confirmationDialogToCancelar, confirmationDialogToFinalizar, confirmationDialogToModificarAnticipos } from 'src/app/utils/change-orden-carga-status';

@Component({
  selector: 'app-orden-carga-edit-form-acciones',
  templateUrl: './orden-carga-edit-form-acciones.component.html',
  styleUrls: ['./orden-carga-edit-form-acciones.component.scss']
})
export class OrdenCargaEditFormAccionesComponent {

  @Input() oc?: OrdenCarga;
  @Input() isAnticiposLiberados = false;
  @Input() isAceptado = false;
  @Input() isCancelado = false;

  @Output() ocChange = new EventEmitter<void>();

  constructor(
    private ordenCargaService: OrdenCargaService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  aceptar(): void {
    confirmationDialogToAceptar(this.dialog, this.ordenCargaService, this.oc!.id, this.snackbar, {
      next: () => { this.ocChange.emit(); }
    });
  }

  cancelar(): void {
    confirmationDialogToCancelar(this.dialog, this.ordenCargaService, this.oc!.id, this.snackbar, {
      next: () => { this.ocChange.emit(); }
    });
  }

  finalizar(): void {
    confirmationDialogToFinalizar(this.dialog, this.ordenCargaService, this.oc!.id, this.snackbar, {
      next: () => { this.ocChange.emit(); }
    });
  }

  modificarAnticipos(): void {
    confirmationDialogToModificarAnticipos(this.dialog, this.ordenCargaService, this.isAnticiposLiberados, this.oc!.id, this.snackbar, {
      next: () => { this.ocChange.emit(); }
    });
  }
}
