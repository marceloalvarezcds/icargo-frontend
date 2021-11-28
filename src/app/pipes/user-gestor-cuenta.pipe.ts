import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermisoAccionEnum, PermisoModeloEnum } from 'src/app/enums/permiso-enum';
import { UserService } from 'src/app/services/user.service';
import { PermisoPipe } from './permiso.pipe';

@Pipe({
  name: 'esUsuarioGestorYPuede'
})
export class UserGestorCuentaPipe implements PipeTransform {

  constructor(
    private userService: UserService,
    private puede: PermisoPipe,
  ) { }

  transform(
    modelo: PermisoModeloEnum | undefined,
    accion: PermisoAccionEnum,
  ): Observable<boolean> {
    if (!modelo) { return of(false); }
    const puede = this.puede.transform(modelo, accion);
    return this.userService.getLoggedUser().pipe(map(user => puede && !!user.gestor_carga_id));
  }
}
