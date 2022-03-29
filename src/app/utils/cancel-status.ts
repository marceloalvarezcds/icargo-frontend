import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { changeStatusConfirm } from './change-status';
import { changeStatusMessageSnackbar } from './snackbar';

interface CancelStatusService<T> {
  cancel(id: number): Observable<T>;
}

export function confirmationDialogToCancel<T>(
  dialog: MatDialog,
  elemento: string,
  service: CancelStatusService<T>,
  idToCancel: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  const message = `¿Está seguro que desea cancelar ${elemento}?`;
  changeStatusConfirm(dialog, message, service.cancel(idToCancel), () => {
    changeStatusMessageSnackbar(snackbar, observer);
  });
}
