import { mockTipoAnticipoList, TipoAnticipo } from './tipo-anticipo';

export interface FleteAnticipo {
  id: number;
  tipo_id: number;
  tipo: TipoAnticipo;
  porcentaje: number;
  flete_id: number;
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
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo1.id,
    tipo: tipoAnticipo1,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo2.id,
    tipo: tipoAnticipo2,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 1,
    tipo_id: tipoAnticipo3.id,
    tipo: tipoAnticipo3,
    porcentaje: 10,
    flete_id: 1,
  },
];
