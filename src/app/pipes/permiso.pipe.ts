import { Pipe, PipeTransform } from '@angular/core';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { UserService } from 'src/app/services/user.service';

@Pipe({
  name: 'puede'
})
export class PermisoPipe implements PipeTransform {

  constructor(private userService: UserService) { }

  transform(modelo: PermisoModeloEnum | undefined, accion: PermisoAccionEnum): boolean {
    if (!modelo) { return false; }
    return this.userService.checkPermiso(accion, modelo);
  }
}
