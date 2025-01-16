import { Pipe, PipeTransform } from '@angular/core';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { UserService } from 'src/app/services/user.service';

@Pipe({
  name: 'puede'
})
export class PermisoPipe implements PipeTransform {

  constructor(private userService: UserService) { }

  transform(modelo: PermisoModeloEnum | undefined, accion: PermisoAccionEnum, gestorCargaId: number | undefined = undefined): boolean {
    if (!modelo) { return false; }
    if (gestorCargaId) {
      return this.userService.checkPermisoAndGestorCargaId(accion, modelo, gestorCargaId);
    }
    return this.userService.checkPermiso(accion, modelo);
  }
}
