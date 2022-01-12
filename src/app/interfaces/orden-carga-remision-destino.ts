import { mockUnidadList } from './unidad';

export interface OrdenCargaRemisionDestinoForm {
  numero_documento: string;
  cantidad: number;
  unidad_id: number;
  foto_documento?: string | null;
  numero_documento_origen?: string | null;
  orden_carga_id: number;
}

export interface OrdenCargaRemisionDestino extends OrdenCargaRemisionDestinoForm {
  id: number;
  fecha: string;
  unidad_abreviatura: string;
  unidad_descripcion: string;
}

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];
const unidad2 = mockUnidadList[2];

export const mockOrdenCargaRemisionDestinoList: OrdenCargaRemisionDestino[] = [
  {
    id: 1,
    fecha: '2021-11-30T20:38:09.553757',
    cantidad: 100,
    numero_documento: '001-001-1000001',
    unidad_id: unidad0.id,
    unidad_abreviatura: unidad0.abreviatura,
    unidad_descripcion: unidad0.descripcion,
    numero_documento_origen: null,
    foto_documento: null,
    orden_carga_id: 1,
  },
  {
    id: 2,
    fecha: '2021-11-30T20:38:09.553757',
    cantidad: 100,
    numero_documento: '001-001-1000002',
    unidad_id: unidad1.id,
    unidad_abreviatura: unidad1.abreviatura,
    unidad_descripcion: unidad1.descripcion,
    numero_documento_origen: null,
    foto_documento: null,
    orden_carga_id: 1,
  },
  {
    id: 3,
    fecha: '2021-11-30T20:38:09.553757',
    cantidad: 100,
    numero_documento: '001-001-1000003',
    unidad_id: unidad2.id,
    unidad_abreviatura: unidad2.abreviatura,
    unidad_descripcion: unidad2.descripcion,
    numero_documento_origen: null,
    foto_documento: null,
    orden_carga_id: 2,
  },
];
