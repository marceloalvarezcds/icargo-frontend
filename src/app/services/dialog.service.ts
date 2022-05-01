import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from './snackbar.service';

interface DeleteService<T> {
  delete(id: number): Observable<T>;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog, private snackbar: SnackbarService) {}

  configDialogRef<Component, Data>(
    dialogRef: MatDialogRef<Component, Data>,
    observer: (value: Data) => void,
    filterFunc: (value?: Data) => boolean = (value?: Data) => !!value
  ) {
    dialogRef
      .afterClosed()
      .pipe(filter(filterFunc))
      .subscribe((data) => observer(data!));
  }

  changeStatusConfirm<T>(
    message: string,
    observable: Observable<T>,
    observer: (value: T) => void
  ) {
    this.configDialogRef(
      this.dialog.open(ConfirmationDialogComponent, {
        data: { message },
      }),
      () => {
        this.snackbar.changeStatus();
        observable.subscribe(observer);
      }
    );
  }

  confirmation<T>(message: string, observer: () => void = () => {}) {
    this.dialog
      .open(ConfirmationDialogComponent, { data: { message } })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => !!confirmed))
      .subscribe(observer);
  }

  confirmationWithSnackbar<T>( // confirmationDialog
    message: string,
    observable: Observable<T>,
    snackbarMessage: string,
    observer?: (value: T) => void
  ) {
    this.confirmation(message, () => {
      observable.subscribe((x) => {
        this.snackbar.open(snackbarMessage);
        observer && observer(x);
      });
    });
  }

  confirmationToDelete<T>(
    message: string,
    observable: Observable<T>,
    observer: (v: T) => void
  ) {
    this.deleteConfirm(message, () => {
      observable.subscribe((x) => {
        this.snackbar.delete();
        observer(x);
      });
    });
  }

  deleteConfirm(message: string, observer: (v: boolean) => void) {
    this.dialog
      .open(ConfirmationDialogComponent, {
        data: { message },
      })
      .afterClosed()
      .pipe(filter((confirmed: boolean) => confirmed))
      .subscribe(observer);
  }
}
