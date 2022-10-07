import { EstadoEnum } from 'src/app/enums/estado-enum';
import { GestorCarga, mockGestorCargaList } from './gestor-carga';
import { mockPermisoList, Permiso } from './permiso';
import { mockRolCheckedList, RolChecked } from './rol';

export interface UserForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  confirm_password?: string;
  gestor_carga_id: number;
  roles: RolChecked[];
}

export interface User extends UserForm {
  id: number;
  token: string;
  surname: string;
  created_ip_address: string;
  last_ip_address: string;
  gestor_carga: GestorCarga;
  estado: EstadoEnum;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface UserAccount extends User {
  permisos: Permiso[];
  is_admin_icargo: boolean;
}

export const mockUser: User = {
  id: 1,
  token: '5bb189b95ced4d7182108b5c04d293e7',
  first_name: 'Fulano',
  last_name: 'Gonzalez',
  username: 'fgonzalez',
  surname: 'fgonzalez',
  email: 'f@gonzalez.com',
  password: '12345678',
  confirm_password: '12345678',
  created_ip_address: '172.19.0.1',
  last_ip_address: '172.19.0.1',
  gestor_carga_id: 1,
  gestor_carga: mockGestorCargaList[0],
  estado: EstadoEnum.ACTIVO,
  roles: mockRolCheckedList.slice(),
  // Auditoría
  created_by: 'System',
  created_at: '2022-03-03T19:38:55.907002',
  modified_by: 'System',
  modified_at: '2022-03-03T19:38:55.907002',
};

export const mockUser2: User = {
  id: 1,
  token: '5bb189b95ced4d7182108b5c04d293e7',
  first_name: 'Mengano',
  last_name: 'Martinez',
  username: 'mmartinez',
  surname: 'mmartinez',
  email: 'm@martinez.com',
  password: '12345678',
  confirm_password: '12345678',
  created_ip_address: '172.19.0.1',
  last_ip_address: '172.19.0.1',
  gestor_carga_id: 2,
  gestor_carga: mockGestorCargaList[1],
  estado: EstadoEnum.ACTIVO,
  roles: mockRolCheckedList.slice(),
  // Auditoría
  created_by: 'System',
  created_at: '2022-03-03T19:38:55.907002',
  modified_by: 'System',
  modified_at: '2022-03-03T19:38:55.907002',
};

export const mockUserList = [mockUser, mockUser2];

export const mockUserAccount: UserAccount = {
  ...mockUser,
  permisos: mockPermisoList,
  is_admin_icargo: false,
};
