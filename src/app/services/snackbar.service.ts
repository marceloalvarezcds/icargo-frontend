import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum,
  PermisoModuloRouterEnum,
} from '../enums/permiso-enum';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private lastSnackbarRef?: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    private snackbar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) {}

  cancelFlete(): void {
    this.open('Pedido cancelado satisfactoriamente');
  }

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
    modulo: PermisoModuloRouterEnum,
    modelo: PermisoModeloEnum,
    id: number,
    routeParams?: string | number | null,
    extras?: NavigationExtras
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (this.lastSnackbarRef) {
      this.lastSnackbarRef.dismiss();
    }
    this.lastSnackbarRef = this.snackbar.open(
      'Datos guardados satisfactoriamente',
      'Ok'
    );
    const m = `${modulo}/${modelo}`;
    const r = routeParams ? routeParams : '';
    if (confirmed) {
      this.router.navigate([backUrl], extras);
    } else if (this.userService.checkPermiso(a.EDITAR, modelo)) {
      this.router.navigate([`/${m}/${a.EDITAR}${r}`, id], extras);
    } else if (this.userService.checkPermiso(a.VER, modelo)) {
      this.router.navigate([`/${m}/${a.VER}${r}`, id], extras);
    } else {
      this.router.navigate([backUrl], extras);
    }
    return this.lastSnackbarRef;
  }

  openUpdate(): MatSnackBarRef<TextOnlySnackBar> {
    return this.open('Datos actualizados satisfactoriamente');
  }

  openUpdateAndRedirect(
    confirmed: boolean,
    backUrl: string,
    extras?: NavigationExtras
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (this.lastSnackbarRef) {
      this.lastSnackbarRef.dismiss();
    }
    this.lastSnackbarRef = this.snackbar.open(
      'Datos guardados satisfactoriamente',
      'Ok'
    );
    if (confirmed) {
      this.router.navigate([backUrl], extras);
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
