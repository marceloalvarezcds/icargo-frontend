import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovimientoFormDialogComponent } from 'src/app/dialogs/movimiento-form-dialog/movimiento-form-dialog.component';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { SnackbarService } from '../services/snackbar.service';
import { redirectToShowOC } from './oc-utils';

export function redirectToShowOCByMovimiento(
  router: Router,
  mov: Movimiento
): void {
  if (mov.numero_documento_relacionado) {
    redirectToShowOC(router, mov.numero_documento_relacionado);
  }
}

function getDialogRef(
  dialog: MatDialog,
  data: MovimientoFormDialogData
): MatDialogRef<MovimientoFormDialogComponent, Movimiento> {
  return dialog.open(MovimientoFormDialogComponent, { data });
}

export function createMovimiento(
  data: MovimientoFormDialogData,
  dialog: MatDialog,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  create(getDialogRef(dialog, data), () => {
    snackbar.open('Movimiento agregado');
    observer();
  });
}

export function editMovimiento(
  data: MovimientoFormDialogData,
  dialog: MatDialog,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  edit(getDialogRef(dialog, data), () => {
    snackbar.open('Movimiento modificado');
    observer();
  });
}

export function deleteMovimiento(
  movimiento: Movimiento,
  dialog: MatDialog,
  service: MovimientoService,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  remove(
    dialog,
    `¿Está seguro que desea eliminar el Movimiento Nº: ${movimiento.id} ? Esta acción no se podrá deshacer`,
    () => {
      service.delete(movimiento.id).subscribe(() => {
        snackbar.open('Movimiento eliminado');
        observer();
      });
    }
  );
}
