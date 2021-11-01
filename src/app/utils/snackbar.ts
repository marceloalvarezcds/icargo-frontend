import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
