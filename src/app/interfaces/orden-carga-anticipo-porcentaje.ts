import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';
import { mockTipoAnticipoList, TipoAnticipo } from './tipo-anticipo';
import { mockTipoInsumoList, TipoInsumo } from './tipo-insumo';

export interface OrdenCargaAnticipoPorcentajeForm {
  id: number | null;
  flete_anticipo_id: number;
  orden_carga_id: number;
  porcentaje: number | null;
  porcentaje_minimo: number | null;
  concepto: string | null;
}

export interface OrdenCargaAnticipoPorcentaje
  extends OrdenCargaAnticipoPorcentajeForm {
  id: number;
  tipo_id: number;
  tipo: TipoAnticipo;
  tipo_descripcion: string;
  flete_anticipo: FleteAnticipo;
  tipo_insumo_id: number | null;
  tipo_insumo: TipoInsumo | null;
  tipo_insumo_descripcion: string | null;
  concepto: string;
  porcentaje: number;
  porcentaje_minimo: number;
  flete_id: number;
}

const tipoAnticipo0 = mockTipoAnticipoList[0];
const tipoAnticipo1 = mockTipoAnticipoList[1];

const tipoInsumo0 = mockTipoInsumoList[0];
const tipoInsumo1 = mockTipoInsumoList[1];

export const mockOrdenCargaAnticipoPorcentajeList: OrdenCargaAnticipoPorcentaje[] =
  [
    {
      id: 1,
      flete_anticipo_id: mockFleteAnticipoList[0].id!,
      flete_anticipo: mockFleteAnticipoList[0],
      orden_carga_id: 1,
      tipo_id: tipoAnticipo0.id,
      tipo: tipoAnticipo0,
      tipo_descripcion: tipoAnticipo0.descripcion,
      tipo_insumo_id: null,
      tipo_insumo: null,
      tipo_insumo_descripcion: null,
      porcentaje: 10,
      porcentaje_minimo: 0,
      concepto: tipoAnticipo0.descripcion,
      flete_id: 1,
    },
    {
      id: 2,
      flete_anticipo_id: mockFleteAnticipoList[1].id!,
      flete_anticipo: mockFleteAnticipoList[1],
      orden_carga_id: 1,
      tipo_id: tipoAnticipo1.id,
      tipo: tipoAnticipo1,
      tipo_descripcion: tipoAnticipo1.descripcion,
      tipo_insumo_id: tipoInsumo0.id,
      tipo_insumo: tipoInsumo0,
      tipo_insumo_descripcion: tipoInsumo0.descripcion,
      porcentaje: 10,
      porcentaje_minimo: 0,
      concepto: tipoInsumo0.descripcion,
      flete_id: 1,
    },
    {
      id: 3,
      flete_anticipo_id: mockFleteAnticipoList[2].id!,
      flete_anticipo: mockFleteAnticipoList[2],
      orden_carga_id: 1,
      tipo_id: tipoAnticipo1.id,
      tipo: tipoAnticipo1,
      tipo_descripcion: tipoAnticipo1.descripcion,
      tipo_insumo_id: tipoInsumo1.id,
      tipo_insumo: tipoInsumo1,
      tipo_insumo_descripcion: tipoInsumo1.descripcion,
      porcentaje: 10,
      porcentaje_minimo: 0,
      concepto: tipoInsumo1.descripcion,
      flete_id: 1,
    },
  ];
