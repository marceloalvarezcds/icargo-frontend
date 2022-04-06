import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  observer: (v: MatSnackBarDismiss) => void = () => {}
): void {
  snackbar.open(message, 'Ok').afterDismissed().subscribe(observer);
}

export function deleteMessageSnackbar(
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void
): void {
  openSnackbarWithMessage(snackbar, 'Eliminado satisfactoriamente', observer);
}

export function changeStatusMessageSnackbar(
  snackbar: MatSnackBar,
  observer: (v: MatSnackBarDismiss) => void = () => {}
): void {
  openSnackbarWithMessage(
    snackbar,
    'Estado cambiado satisfactoriamente',
    observer
  );
}
