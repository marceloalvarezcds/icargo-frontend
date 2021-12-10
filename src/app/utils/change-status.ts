import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { changeStatusMessageSnackbar } from './snackbar';

interface ChangeStatusService<T> {
  active(id: number): Observable<T>;
  inactive(id: number): Observable<T>;
}

export const changeStatusConfirm = (dialog: MatDialog, message: string, observer?: PartialObserver<boolean> | undefined) => {
  dialog
    .open(ConfirmationDialogComponent, {
      data: { message },
    })
    .afterClosed()
    .pipe(filter((confirmed: boolean) => confirmed))
    .subscribe(observer);
}

export function confirmationDialogToActive<T>(
  dialog: MatDialog,
  message: string,
  service: ChangeStatusService<T>,
  idToActive: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, message, {
    next: () => {
      service.active(idToActive).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}

export function confirmationDialogToInactive<T>(
  dialog: MatDialog,
  message: string,
  service: ChangeStatusService<T>,
  idToInactive: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, message, {
    next: () => {
      service.inactive(idToInactive).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}
