import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovimientoFormDialogComponent } from 'src/app/dialogs/movimiento-form-dialog/movimiento-form-dialog.component';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
} from 'src/app/enums/permiso-enum';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { openSnackbarWithMessage } from 'src/app/utils/snackbar';
import { create, edit, remove } from 'src/app/utils/table-event-crud';

export function redirectToShowOCByMovimiento(
  router: Router,
  mov: Movimiento
): void {
  const url = router.serializeUrl(
    router.createUrlTree([
      `/orden-carga/${m.ORDEN_CARGA}/${a.VER}`,
      mov.numero_documento_relacionado,
    ])
  );
  window.open(url, '_blank');
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
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void = () => {}
): void {
  create(getDialogRef(dialog, data), () => {
    openSnackbarWithMessage(snackbar, 'Movimiento agregado', observer);
  });
}

export function editMovimiento(
  data: MovimientoFormDialogData,
  dialog: MatDialog,
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void = () => {}
): void {
  edit(getDialogRef(dialog, data), () => {
    openSnackbarWithMessage(snackbar, 'Movimiento modificado', observer);
  });
}

export function deleteMovimiento(
  movimiento: Movimiento,
  dialog: MatDialog,
  service: MovimientoService,
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void = () => {}
): void {
  remove(
    dialog,
    `¿Está seguro que desea eliminar el Movimiento Nº: ${movimiento.id} ? Esta acción no se podrá deshacer`,
    () => {
      service.delete(movimiento.id).subscribe(() => {
        openSnackbarWithMessage(snackbar, 'Movimiento eliminado', observer);
      });
    }
  );
}
