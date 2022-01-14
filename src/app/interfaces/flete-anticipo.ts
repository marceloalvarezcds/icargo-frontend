import { mockTipoAnticipoList, TipoAnticipo } from './tipo-anticipo';
import { mockTipoInsumoList } from './tipo-insumo';

export interface FleteAnticipoForm {
  id?: number | null;
  tipo_id: number;
  tipo_descripcion: string;
  tipo_insumo_id?: number | null;
  tipo_insumo_descripcion?: string | null;
  porcentaje: number | null;
}

export interface FleteAnticipo extends FleteAnticipoForm {
  tipo: TipoAnticipo;
  flete_id?: number;
}

const tipoAnticipo0 = mockTipoAnticipoList[0];
const tipoAnticipo1 = mockTipoAnticipoList[1];

const tipoInsumo0 = mockTipoInsumoList[0];
const tipoInsumo1 = mockTipoInsumoList[1];

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
    id: 2,
    tipo_id: tipoAnticipo1.id,
    tipo: tipoAnticipo1,
    tipo_descripcion: tipoAnticipo1.descripcion,
    tipo_insumo_id: tipoInsumo0.id,
    tipo_insumo_descripcion: tipoInsumo0.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
  {
    id: 3,
    tipo_id: tipoAnticipo1.id,
    tipo: tipoAnticipo1,
    tipo_descripcion: tipoAnticipo1.descripcion,
    tipo_insumo_id: tipoInsumo1.id,
    tipo_insumo_descripcion: tipoInsumo1.descripcion,
    porcentaje: 10,
    flete_id: 1,
  },
];
