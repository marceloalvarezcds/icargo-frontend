import { EstadoEnum } from '../enums/estado-enum';
import { CodigoRolEnum } from '../enums/rol-enum';

export interface Rol {
  id: number;
  codigo: CodigoRolEnum;
  descripcion: string;
  estado: EstadoEnum;
}

export const mockRolList: Rol[] = [
  {
    id: 1,
    codigo:CodigoRolEnum.ADMIN_GESTOR_CARGA,
    descripcion: 'Administrador de Gestor de Carga',
    estado: EstadoEnum.ACTIVO,
  },
  {
    id: 2,
    codigo:CodigoRolEnum.ADMIN_ICARGO,
    descripcion: 'Administrador de Icargo',
    estado: EstadoEnum.ACTIVO,
  },
];
