import { EstadoEnum } from '../enums/estado-enum';
import { CodigoRolEnum } from '../enums/rol-enum';
import { mockPermisoList, Permiso } from './permiso';

export interface Rol {
  id: number;
  codigo: CodigoRolEnum;
  descripcion: string;
  estado: EstadoEnum;
  permisos: Permiso[];
}

export const mockRolList: Rol[] = [
  {
    id: 1,
    codigo:CodigoRolEnum.ADMIN_GESTOR_CARGA,
    descripcion: 'Administrador de Gestor de Carga',
    estado: EstadoEnum.ACTIVO,
    permisos: [],
  },
  {
    id: 2,
    codigo:CodigoRolEnum.ADMIN_ICARGO,
    descripcion: 'Administrador de Icargo',
    estado: EstadoEnum.ACTIVO,
    permisos: mockPermisoList,
  },
];
