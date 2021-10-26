import { GestorCarga, mockGestorCargaList } from "./gestor-carga";
import { mockRolList, Rol } from "./rol";

export interface User {
  id: number;
  token: string;
  first_name: string;
  last_name: string;
  username: string;
  surname: string;
  email: string;
  password?: string;
  activation_code: string | null;
  persist_code: string | null;
  reset_password_code: string | null;
  permissions: string | null;
  activated_at: string | null;
  last_login: string | null;
  is_activated: boolean;
  is_guest: boolean;
  is_superuser: boolean;
  last_activity: string | null;
  last_seen: string | null;
  created_ip_address: string;
  last_ip_address: string;
  gestor_carga_id: number;
  gestor_carga: GestorCarga;
  roles: Rol[];
}

export const mockUser: User = {
  id: 1,
  token: "5bb189b95ced4d7182108b5c04d293e7",
  first_name: "Fulano",
  last_name: "Gonzalez",
  username: "fgonzalez",
  surname: "fgonzalez",
  email: "f@gonzalez.com",
  is_activated: true,
  is_guest: false,
  is_superuser: false,
  reset_password_code: null,
  activation_code: null,
  persist_code: null,
  permissions: null,
  activated_at: "2021-09-14T18:29:46",
  last_login: null,
  last_activity: null,
  last_seen: null,
  created_ip_address: "172.19.0.1",
  last_ip_address: "172.19.0.1",
  gestor_carga_id: 1,
  gestor_carga: mockGestorCargaList[0],
  roles: mockRolList.slice(),
}
