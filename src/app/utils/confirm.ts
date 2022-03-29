import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { openSnackbarWithMessage } from './snackbar';

export const confirm = (
  dialog: MatDialog,
  message: string,
  observer?: (value: boolean) => void | PartialObserver<MatSnackBarDismiss>
) => {
  dialog
    .open(ConfirmationDialogComponent, {
      data: { message },
    })
    .afterClosed()
    .pipe(filter((confirmed: boolean) => confirmed))
    .subscribe(observer);
};

export function confirmationDialog<T>(
  dialog: MatDialog,
  message: string,
  observable: Observable<T>,
  snackbar: MatSnackBar,
  snackbarMessage: string,
  observer?: (
    value: MatSnackBarDismiss
  ) => void | PartialObserver<MatSnackBarDismiss>
) {
  confirm(dialog, message, () => {
    observable.subscribe(() => {
      openSnackbarWithMessage(snackbar, snackbarMessage, observer);
    });
  });
}
