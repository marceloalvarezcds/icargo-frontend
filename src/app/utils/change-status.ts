import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { changeStatusMessageSnackbar } from './snackbar';

interface ChangeStatusService<T> {
  active(id: number): Observable<T>;
  inactive(id: number): Observable<T>;
}

export const configDialogRef = <Component, Data>(
  dialogRef: MatDialogRef<Component, Data>,
  observer: (value: Data) => void,
  filterFunc: (value?: Data) => boolean = (value?: Data) => !!value
) => {
  dialogRef
    .afterClosed()
    .pipe(filter(filterFunc))
    .subscribe((data) => observer(data!));
};

export const changeStatusConfirm = <T>(
  dialog: MatDialog,
  message: string,
  observable: Observable<T>,
  observer: (value: T) => void
) => {
  configDialogRef(
    dialog.open(ConfirmationDialogComponent, {
      data: { message },
    }),
    () => {
      observable.subscribe(observer);
    }
  );
};

export function confirmationDialogToActive<T>(
  dialog: MatDialog,
  elemento: string,
  service: ChangeStatusService<T>,
  idToActive: number,
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void
) {
  const message = `¿Está seguro que desea activar ${elemento}?`;
  changeStatusConfirm(dialog, message, service.active(idToActive), () =>
    changeStatusMessageSnackbar(snackbar, observer)
  );
}

export function confirmationDialogToInactive<T>(
  dialog: MatDialog,
  elemento: string,
  service: ChangeStatusService<T>,
  idToInactive: number,
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void
) {
  const message = `¿Está seguro que desea desactivar ${elemento}?`;
  changeStatusConfirm(dialog, message, service.inactive(idToInactive), () =>
    changeStatusMessageSnackbar(snackbar, observer)
  );
}
