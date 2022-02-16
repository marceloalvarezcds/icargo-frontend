import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';

export function create<D, T>(dialogRef: MatDialogRef<D>, observer: (v: T) => void): void {
  dialogRef
    .afterClosed()
    .pipe(filter((value) => !!value))
    .subscribe(observer);
}

export function edit<D, T>(dialogRef: MatDialogRef<D>, observer: (v: T) => void): void {
  dialogRef
    .afterClosed()
    .pipe(filter((value) => !!value))
    .subscribe(observer);
}

export function remove(dialog: MatDialog, message: string, observer: (v: boolean) => void): void {
  dialog
    .open(ConfirmationDialogComponent, { data: { message } })
    .afterClosed()
    .pipe(filter((confirmed: boolean) => confirmed))
    .subscribe(observer);
}
