import { UserAccount } from '../interfaces/user';
import { PermisoAccionEnum, PermisoModeloEnum } from '../enums/permiso-enum';

export const findPermiso = (user: UserAccount, accion: PermisoAccionEnum, modelo: PermisoModeloEnum): boolean => {
  return user.permisos.findIndex(p => p.accion === accion && p.modelo === modelo && p.autorizado) !== -1
}

export const checkPermiso = (user: UserAccount | null, accion: PermisoAccionEnum, modelo: PermisoModeloEnum): boolean => {
  if (!user) { return false; }
  return findPermiso(user, accion, modelo);
}

export const checkPermisoAndGestorCargaId = (user: UserAccount | null, accion: PermisoAccionEnum, modelo: PermisoModeloEnum, gestorCuentaId: number | undefined): boolean => {
  if (!user) { return false; }
  return findPermiso(user, accion, modelo) && user.gestor_carga_id === gestorCuentaId;
}
