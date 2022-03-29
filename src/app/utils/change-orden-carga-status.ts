import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { changeStatusConfirm } from './change-status';
import { changeStatusMessageSnackbar } from './snackbar';

interface AceptarService<T> {
  aceptar(id: number): Observable<T>;
}

interface CancelarService<T> {
  cancelar(id: number): Observable<T>;
}

interface ChangeOrdenCargaStatusService<T>
  extends AceptarService<T>,
    CancelarService<T> {
  conciliar(id: number): Observable<T>;
  finalizar(id: number): Observable<T>;
  modificarAnticipos(id: number): Observable<T>;
}

const getMessage = (status: string, entidad: string = 'la Orden de Carga') =>
  `¿Está seguro que desea ${status} ${entidad}?`;

export function confirmationDialogToAceptar<T>(
  dialog: MatDialog,
  service: AceptarService<T>,
  idToAceptar: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  changeStatusConfirm(
    dialog,
    getMessage('aceptar'),
    service.aceptar(idToAceptar),
    () => changeStatusMessageSnackbar(snackbar, observer)
  );
}

export function confirmationDialogToCancelar<T>(
  dialog: MatDialog,
  service: CancelarService<T>,
  idToCancelar: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  changeStatusConfirm(
    dialog,
    getMessage('cancelar'),
    service.cancelar(idToCancelar),
    () => changeStatusMessageSnackbar(snackbar, observer)
  );
}

export function confirmationDialogToConciliar<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  idToConciliar: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  changeStatusConfirm(
    dialog,
    getMessage('conciliar'),
    service.conciliar(idToConciliar),
    () => changeStatusMessageSnackbar(snackbar, observer)
  );
}

export function confirmationDialogToFinalizar<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  idToFinalizar: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  changeStatusConfirm(
    dialog,
    getMessage('finalizar'),
    service.finalizar(idToFinalizar),
    () => changeStatusMessageSnackbar(snackbar, observer)
  );
}

export function confirmationDialogToModificarAnticipos<T>(
  dialog: MatDialog,
  service: ChangeOrdenCargaStatusService<T>,
  isAnticiposLiberados: boolean,
  idToModificarAnticipos: number,
  snackbar: MatSnackBar,
  observer: (value: MatSnackBarDismiss) => void
) {
  changeStatusConfirm(
    dialog,
    `¿Está seguro que desea ${
      isAnticiposLiberados ? 'bloquear' : 'liberar'
    } anticipos?`,
    service.modificarAnticipos(idToModificarAnticipos),
    () => changeStatusMessageSnackbar(snackbar, observer)
  );
}
