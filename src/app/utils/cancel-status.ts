import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, PartialObserver } from 'rxjs';
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
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  const message = `¿Está seguro que desea cancelar ${elemento}?`;
  changeStatusConfirm(dialog, message, {
    next: () => {
      service.cancel(idToCancel).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}
