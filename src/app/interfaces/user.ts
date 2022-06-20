import { EstadoEnum } from 'src/app/enums/estado-enum';
import { GestorCarga, mockGestorCargaList } from './gestor-carga';
import { mockPermisoList, Permiso } from './permiso';
import { mockRolList, Rol } from './rol';

export interface UserForm {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  confirm_password?: string;
  gestor_carga_id: number;
  roles: Rol[];
}

export interface User extends UserForm {
  id: number;
  token: string;
  surname: string;
  activation_code: string | null;
  persist_code: string | null;
  reset_password_code: string | null;
  permissions: string | null;
  activated_at: string | null;
  last_login: string | null;
  last_activity: string | null;
  last_seen: string | null;
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
}

export const mockUser: User = {
  id: 1,
  token: '5bb189b95ced4d7182108b5c04d293e7',
  first_name: 'Fulano',
  last_name: 'Gonzalez',
  username: 'fgonzalez',
  surname: 'fgonzalez',
  email: 'f@gonzalez.com',
  password: '123456',
  confirm_password: '123456',
  reset_password_code: null,
  activation_code: null,
  persist_code: null,
  permissions: null,
  activated_at: '2021-09-14T18:29:46',
  last_login: null,
  last_activity: null,
  last_seen: null,
  created_ip_address: '172.19.0.1',
  last_ip_address: '172.19.0.1',
  gestor_carga_id: 1,
  gestor_carga: mockGestorCargaList[0],
  estado: EstadoEnum.ACTIVO,
  roles: mockRolList.slice(),
  // Auditoría
  created_by: 'System',
  created_at: '2022-03-03T19:38:55.907002',
  modified_by: 'System',
  modified_at: '2022-03-03T19:38:55.907002',
};

export const mockUserAccount: UserAccount = {
  ...mockUser,
  permisos: mockPermisoList,
};
