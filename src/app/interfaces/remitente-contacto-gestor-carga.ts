import { Cargo, mockCargoList } from './cargo';
import { Contacto, mockContacto } from './contacto';

export interface RemitenteContactoGestorCarga {
  id?: number;
  cargo_id:  number;
  cargo: Cargo
  remitente_id?: number;
  contacto_id?: number;
  contacto: Contacto;
  gestor_carga_id?: number;
  alias?: string;
}

export interface RemitenteContactoGestorCargaList extends RemitenteContactoGestorCarga {
  cargo_descripcion: string;
  contacto_nombre: string;
  contacto_apellido: string;
  contacto_telefono: string;
  contacto_email: string;
}

export const mockRemitenteContactoGestorCarga: RemitenteContactoGestorCarga = {
  id: 1,
  cargo_id:  1,
  cargo: mockCargoList[0],
  remitente_id: 1,
  contacto_id: 1,
  contacto: mockContacto,
  gestor_carga_id: 1,
};

const cargo1 = mockCargoList[0];
const cargo2 = mockCargoList[1];

export const mockRemitenteContactoGestorCargaList: RemitenteContactoGestorCargaList[] = [
  {
    id: 1,
    cargo_id:  1,
    cargo: cargo1,
    remitente_id: 1,
    contacto_id: 1,
    contacto: mockContacto,
    gestor_carga_id: 1,
    alias: mockContacto.nombre,
    cargo_descripcion: cargo1.descripcion,
    contacto_nombre: mockContacto.nombre,
    contacto_apellido: mockContacto.apellido,
    contacto_telefono: mockContacto.telefono,
    contacto_email: mockContacto.email,
  },
  {
    id: 2,
    cargo_id:  2,
    cargo: cargo2,
    remitente_id: 1,
    contacto_id: 1,
    contacto: mockContacto,
    gestor_carga_id: 1,
    alias: mockContacto.nombre,
    cargo_descripcion: cargo2.descripcion,
    contacto_nombre: mockContacto.nombre,
    contacto_apellido: mockContacto.apellido,
    contacto_telefono: mockContacto.telefono,
    contacto_email: mockContacto.email,
  },
];
