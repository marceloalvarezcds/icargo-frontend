import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';

export function openSnackbar(
  snackbar: MatSnackBar,
  confirmed: boolean,
  router: Router,
  backUrl: string
): void {
  snackbar
    .open('Datos guardados satisfactoriamente', 'Ok')
    .afterDismissed()
    .pipe(filter(() => confirmed))
    .subscribe(() => {
      router.navigate([backUrl]);
    });
}

export function openSnackbarWithMessage(
  snackbar: MatSnackBar,
  message: string,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined
): void {
  snackbar.open(message, 'Ok').afterDismissed().subscribe(observer);
}

export function deleteMessageSnackbar(
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined
): void {
  openSnackbarWithMessage(snackbar, 'Eliminado satisfactoriamente', observer);
}

export function changeStatusMessageSnackbar(
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined
): void {
  openSnackbarWithMessage(
    snackbar,
    'Estado cambiado satisfactoriamente',
    observer
  );
}
