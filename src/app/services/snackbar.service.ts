import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private lastSnackbarRef?: MatSnackBarRef<TextOnlySnackBar>;

  constructor(private snackbar: MatSnackBar, private router: Router) {}

  changeStatus(): void {
    this.open('Estado cambiado satisfactoriamente');
  }

  delete(): void {
    this.open('Eliminado satisfactoriamente');
  }

  openSave(): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('Datos guardados satisfactoriamente');
  }

  openSaveAndRedirect(
    confirmed: boolean,
    backUrl: string,
    editUrl: any[]
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (this.lastSnackbarRef) {
      this.lastSnackbarRef.dismiss();
    }
    this.lastSnackbarRef = this.snackbar.open(
      'Datos guardados satisfactoriamente',
      'Ok'
    );
    if (confirmed) {
      this.router.navigate([backUrl]);
    } else {
      this.router.navigate(editUrl);
    }
    return this.lastSnackbarRef;
  }

  openUpdateAndRedirect(
    confirmed: boolean,
    backUrl: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (this.lastSnackbarRef) {
      this.lastSnackbarRef.dismiss();
    }
    this.lastSnackbarRef = this.snackbar.open(
      'Datos guardados satisfactoriamente',
      'Ok'
    );
    if (confirmed) {
      this.router.navigate([backUrl]);
    }
    return this.lastSnackbarRef;
  }

  open(message: string): MatSnackBarRef<TextOnlySnackBar> {
    if (this.lastSnackbarRef) {
      this.lastSnackbarRef.dismiss();
    }
    this.lastSnackbarRef = this.snackbar.open(message, 'Ok');
    return this.lastSnackbarRef;
  }
}
