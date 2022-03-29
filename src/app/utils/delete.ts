import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { deleteMessageSnackbar } from './snackbar';

interface DeleteService<T> {
  delete(id: number): Observable<T>;
}

export const deleteConfirm = (
  dialog: MatDialog,
  message: string,
  observer: (v: boolean) => void
) => {
  dialog
    .open(ConfirmationDialogComponent, {
      data: { message },
    })
    .afterClosed()
    .pipe(filter((confirmed: boolean) => confirmed))
    .subscribe(observer);
};

export function confirmationDialogToDelete<T>(
  dialog: MatDialog,
  message: string,
  service: DeleteService<T>,
  idToDelete: number,
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void
) {
  deleteConfirm(dialog, message, () => {
    service.delete(idToDelete).subscribe(() => {
      deleteMessageSnackbar(snackbar, observer);
    });
  });
}
