import { ContactoGestorCarga, ContactoGestorCargaList, mockContactoGestorCarga, mockContactoGestorCargaList } from './contacto-gestor-carga';

export interface CentroOperativoContactoGestorCarga extends ContactoGestorCarga {
  centro_operativo_id?: number;
}

export interface CentroOperativoContactoGestorCargaList extends ContactoGestorCargaList {
  centro_operativo_id?: number;
}

export const mockCentroOperativoContactoGestorCarga: CentroOperativoContactoGestorCarga = {
  ...mockContactoGestorCarga,
  centro_operativo_id: 1,
};

const contactoGestorCarga1 = mockContactoGestorCargaList[0];
const contactoGestorCarga2 = mockContactoGestorCargaList[1];

export const mockCentroOperativoContactoGestorCargaList: CentroOperativoContactoGestorCargaList[] = [
  {
    ...contactoGestorCarga1,
    centro_operativo_id: 1,
  },
  {
    ...contactoGestorCarga2,
    centro_operativo_id: 1,
  },
];
