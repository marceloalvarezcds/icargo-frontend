import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { deleteMessageSnackbar } from './snackbar';

interface DeleteService<T> {
  delete(id: number): Observable<T>;
}

export const deleteConfirm = (dialog: MatDialog, message: string, observer?: PartialObserver<boolean> | undefined) => {
  dialog
    .open(ConfirmationDialogComponent, {
      data: { message },
    })
    .afterClosed()
    .pipe(filter((confirmed: boolean) => confirmed))
    .subscribe(observer);
}

export function confirmationDialogToDelete<T>(
  dialog: MatDialog,
  message: string,
  service: DeleteService<T>,
  idToDelete: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  deleteConfirm(dialog, message, {
    next: () => {
      service.delete(idToDelete).subscribe(() => {
        deleteMessageSnackbar(snackbar, observer);
      });
    }
  });
}
