import { Cargo, mockCargoList } from './cargo';
import { Contacto, mockContacto } from './contacto';

export interface ContactoGestorCarga {
  id?: number;
  cargo_id: number;
  cargo: Cargo
  contacto_id?: number;
  contacto: Contacto;
  gestor_carga_id?: number;
  alias?: string;
}

export interface ContactoGestorCargaList extends ContactoGestorCarga {
  cargo_descripcion: string;
  contacto_nombre: string;
  contacto_apellido: string;
  contacto_telefono: string;
  contacto_email: string;
}

export const mockContactoGestorCarga: ContactoGestorCarga = {
  id: 1,
  cargo_id: 1,
  cargo: mockCargoList[0],
  contacto_id: 1,
  contacto: mockContacto,
  gestor_carga_id: 1,
};

const cargo1 = mockCargoList[0];
const cargo2 = mockCargoList[1];

export const mockContactoGestorCargaList: ContactoGestorCargaList[] = [
  {
    id: 1,
    cargo_id: 1,
    cargo: cargo1,
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
    cargo_id: 2,
    cargo: cargo2,
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
