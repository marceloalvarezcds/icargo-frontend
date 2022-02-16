import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable, PartialObserver } from 'rxjs';
import { changeStatusConfirm } from './change-status';
import { changeStatusMessageSnackbar } from './snackbar';

interface ChangeOrdenCargaStatusService<T> {
  aceptar(id: number): Observable<T>;
  cancelar(id: number): Observable<T>;
  finalizar(id: number): Observable<T>;
  modificarAnticipos(id: number): Observable<T>;
}

const getMessage = (status: string) => `¿Está seguro que desea ${status} la Orden de Carga?`

export function confirmationDialogToAceptar<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  idToAceptar: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, getMessage('aceptar'), {
    next: () => {
      service.aceptar(idToAceptar).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}

export function confirmationDialogToCancelar<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  idToCancelar: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, getMessage('cancelar'), {
    next: () => {
      service.cancelar(idToCancelar).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}

export function confirmationDialogToFinalizar<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  idToFinalizar: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, getMessage('finalizar'), {
    next: () => {
      service.finalizar(idToFinalizar).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}

export function confirmationDialogToModificarAnticipos<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  isAnticiposLiberados: boolean,
  idToModificarAnticipos: number,
  snackbar: MatSnackBar,
  observer?: PartialObserver<MatSnackBarDismiss> | undefined,
) {
  changeStatusConfirm(dialog, `¿Está seguro que desea ${isAnticiposLiberados ? 'bloquear' : 'liberar'} anticipos?`, {
    next: () => {
      service.modificarAnticipos(idToModificarAnticipos).subscribe(() => {
        changeStatusMessageSnackbar(snackbar, observer);
      });
    }
  });
}
