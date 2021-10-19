import { Cargo, mockCargoList } from './cargo';
import { Contacto, mockContacto } from './contacto';

export interface CentroOperativoContactoGestorCarga {
  id?: number;
  cargo_id:  number;
  cargo: Cargo
  centro_operativo_id?: number;
  contacto_id?: number;
  contacto: Contacto;
  gestor_carga_id?: number;
}

export interface CentroOperativoContactoGestorCargaList extends CentroOperativoContactoGestorCarga {
  cargo_descripcion: string;
  contacto_nombre: string;
  contacto_apellido: string;
  contacto_telefono: string;
  contacto_email: string;
}

export const mockCentroOperativoContactoGestorCarga: CentroOperativoContactoGestorCarga = {
  id: 1,
  cargo_id:  1,
  cargo: mockCargoList[0],
  centro_operativo_id: 1,
  contacto_id: 1,
  contacto: mockContacto,
  gestor_carga_id: 1,
};

const cargo1 = mockCargoList[0];
const cargo2 = mockCargoList[1];

export const mockCentroOperativoContactoGestorCargaList: CentroOperativoContactoGestorCargaList[] = [
  {
    id: 1,
    cargo_id:  1,
    cargo: cargo1,
    centro_operativo_id: 1,
    contacto_id: 1,
    contacto: mockContacto,
    gestor_carga_id: 1,
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
    centro_operativo_id: 1,
    contacto_id: 1,
    contacto: mockContacto,
    gestor_carga_id: 1,
    cargo_descripcion: cargo2.descripcion,
    contacto_nombre: mockContacto.nombre,
    contacto_apellido: mockContacto.apellido,
    contacto_telefono: mockContacto.telefono,
    contacto_email: mockContacto.email,
  },
];
