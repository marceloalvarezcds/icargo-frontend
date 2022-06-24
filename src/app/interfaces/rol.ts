import { EstadoEnum } from '../enums/estado-enum';
import { CodigoRolEnum } from '../enums/rol-enum';
import { mockPermisoList, Permiso } from './permiso';

export interface Rol {
  id: number;
  codigo: CodigoRolEnum;
  descripcion: string;
  estado: EstadoEnum;
  gestor_carga_id: number;
  permisos: Permiso[];
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockRolList: Rol[] = [
  {
    id: 1,
    codigo: CodigoRolEnum.ADMIN_GESTOR_CARGA,
    descripcion: 'Administrador de Gestor de Carga',
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: 1,
    permisos: mockPermisoList.slice(0, 3),
    // Auditoría
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
  {
    id: 2,
    codigo: CodigoRolEnum.ADMIN_ICARGO,
    descripcion: 'Administrador de Icargo',
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: 2,
    permisos: [],
    // Auditoría
    created_by: 'System',
    created_at: '2022-03-03T19:38:55.907002',
    modified_by: 'System',
    modified_at: '2022-03-03T19:38:55.907002',
  },
];

export const mockRol = mockRolList[0];
