import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovimientoFormDialogComponent } from 'src/app/dialogs/movimiento-form-dialog/movimiento-form-dialog.component';
import { Movimiento } from 'src/app/interfaces/movimiento';
import { MovimientoFormDialogData } from 'src/app/interfaces/movimiento-form-dialog-data';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { create, edit, remove } from 'src/app/utils/table-event-crud';
import { SnackbarService } from '../services/snackbar.service';
import { redirectToShowOC } from './oc-utils';

export function redirectToShowOCByMovimiento(
  router: Router,
  mov: Movimiento
): void {
  if (mov.numero_documento_relacionado) {
    redirectToShowOC(router, mov.numero_documento_relacionado);
  }
}

function getDialogRef(
  dialog: MatDialog,
  data: MovimientoFormDialogData
): MatDialogRef<MovimientoFormDialogComponent, Movimiento> {
  return dialog.open(MovimientoFormDialogComponent, { data, panelClass: 'half-dialog',});
}

export function createMovimiento(
  data: MovimientoFormDialogData,
  dialog: MatDialog,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  create(getDialogRef(dialog, data), () => {
    snackbar.open('Movimiento agregado');
    observer();
  });
}

export function editMovimiento(
  data: MovimientoFormDialogData,
  dialog: MatDialog,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  edit(getDialogRef(dialog, data), () => {
    snackbar.open('Movimiento modificado');
    observer();
  });
}

export function deleteMovimiento(
  movimiento: Movimiento,
  dialog: MatDialog,
  service: MovimientoService,
  snackbar: SnackbarService,
  observer: () => void = () => {}
): void {
  remove(
    dialog,
    `¿Está seguro que desea eliminar el Movimiento Nº: ${movimiento.id} ? Esta acción no se podrá deshacer`,
    () => {
      service.delete(movimiento.id).subscribe(() => {
        snackbar.open('Movimiento eliminado');
        observer();
      });
    }
  );
}

export function getClassColorForState(estado:string):string {
  switch (estado) {
    case 'Activo':
      return 'activo'; // Verde
    case 'Inactivo':
      return 'inactivo';
    case 'Aceptado':
      return 'aceptado';
    case 'Conciliado':
      return 'conliliado';
    case 'Pendiente':
      return 'pendiente';
    case 'Provision':
      return 'provision';
    case 'En Revisión':
      return 'revision';
    default:
      return ''; // Color por defecto o para otros estados
  }
}

export function getColorForState(estado:string):string {
  switch (estado) {
    case 'Activo':
      return '#008000'; // Verde
    case 'Aceptado':
      return '#008000'; // Verde
    case 'Conciliado':
      return '#9747FF';
    case 'Finalizado':
      return '#89969F';
    case 'Inactivo':
      return '#FF0000'; // Rojo
    case 'Pendiente':
      return '#FFA500'; // Naranja
    case 'Provision':
      return 'gray'; // Naranja
    case 'Anulado':
      return 'red';
    case 'Saldo abierto':
      return '#9747FF';
    case 'Saldo cerrado':
      return '#89969F';
    case 'En Revisión':
      return '#008000'; // Verde
    case 'Pendiente':
      return '#FFA500'; // Naranja
    case 'Rechazado':
      return '#FF0000'; // Rojo
    default:
      return '#000000'; // Color por defecto o para otros estados
  }

}
