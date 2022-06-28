import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { capitalize } from 'lodash';
import {
  PermisoAccionEnum as a,
  PermisoModeloEnum as m,
  permisoModeloTitulo as t,
} from 'src/app/enums/permiso-enum';
import { HttpErrorService } from 'src/app/services/http-error.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class PermisoGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private httpErrorService: HttpErrorService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const accion = route.routeConfig!.path!.split(/\/:/)[0] as a;
    const modelo = route.parent!.routeConfig!.path! as m;
    if (!this.userService.checkPermiso(accion, modelo)) {
      const action = capitalize(accion.split('_').join(' '));
      const mmodel = t[modelo];
      this.httpErrorService.setErrorList([
        `No tiene permiso para ${action} ${mmodel}`,
      ]);
      return false;
    }
    return true;
  }
}
