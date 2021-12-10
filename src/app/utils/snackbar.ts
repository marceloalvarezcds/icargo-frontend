import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { filter } from 'rxjs/operators';

export function openSnackbar(snackbar: MatSnackBar, confirmed: boolean, router: Router, backUrl: string): void {
  snackbar
    .open('Datos guardados satisfactoriamente', 'Ok')
    .afterDismissed()
    .pipe(filter(() => confirmed))
    .subscribe(() => {
      router.navigate([backUrl]);
    });
}

export function deleteMessageSnackbar(snackbar: MatSnackBar, observer?: PartialObserver<MatSnackBarDismiss> | undefined): void {
  snackbar
  .open('Eliminado satisfactoriamente', 'Ok')
  .afterDismissed()
  .subscribe(observer);
}

export function changeStatusMessageSnackbar(snackbar: MatSnackBar, observer?: PartialObserver<MatSnackBarDismiss> | undefined): void {
  snackbar
  .open('Estado cambiado satisfactoriamente', 'Ok')
  .afterDismissed()
  .subscribe(observer);
}
