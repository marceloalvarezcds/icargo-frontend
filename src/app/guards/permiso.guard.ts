import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { PermisoAccionEnum as a, PermisoModeloEnum as m } from 'src/app/enums/permiso-enum';
import { HttpErrorService } from 'src/app/services/http-error.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private httpErrorService: HttpErrorService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const accion = route.routeConfig!.path!.split(/\/:/)[0] as a;
    const modelo = route.parent!.routeConfig!.path! as m;
    if (!this.userService.checkPermiso(accion, modelo)) {
      this.httpErrorService.setErrorList(['No tiene permiso para realizar esta acción']);
      return false;
    }
    return true;
  }
}
