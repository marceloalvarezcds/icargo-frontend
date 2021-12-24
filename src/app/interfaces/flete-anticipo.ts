import { mockTipoAnticipoList, TipoAnticipo } from './tipo-anticipo';

export interface FleteAnticipoForm {
  id?: number | null;
  tipo_id: number;
  tipo_descripcion: string;
  porcentaje: number | null;
}

export interface FleteAnticipo extends FleteAnticipoForm {
  tipo: TipoAnticipo;
  flete_id?: number;
}

const tipoAnticipo0 = mockTipoAnticipoList[0];
const tipoAnticipo1 = mockTipoAnticipoList[1];
const tipoAnticipo2 = mockTipoAnticipoList[2];
const tipoAnticipo3 = mockTipoAnticipoList[3];

export const mockFleteAnticipoList: FleteAnticipo[] = [
  {
    id: 1,
    tipo_id: tipoAnticipo0.id,
    tipo: tipoAnticipo0,
    tipo_descripcion: tipoAnticipo0.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo1.id,
    tipo: tipoAnticipo1,
    tipo_descripcion: tipoAnticipo1.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo2.id,
    tipo: tipoAnticipo2,
    tipo_descripcion: tipoAnticipo2.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo3.id,
    tipo: tipoAnticipo3,
    tipo_descripcion: tipoAnticipo3.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
];
