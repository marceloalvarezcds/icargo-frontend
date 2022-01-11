import { mockUnidadList } from './unidad';

export interface OrdenCargaRemisionOrigenForm {
  numero_documento: string;
  cantidad: number;
  unidad_id: number;
  foto_documento?: string | null;
  orden_carga_id: number;
}

export interface OrdenCargaRemisionOrigen extends OrdenCargaRemisionOrigenForm {
  id: number;
  fecha: string;
  unidad_abreviatura: string;
  unidad_descripcion: string;
}

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];
const unidad2 = mockUnidadList[2];

export const mockOrdenCargaRemisionOrigenList: OrdenCargaRemisionOrigen[] = [
  {
    id: 1,
    fecha: '2021-11-30T20:38:09.553757',
    cantidad: 100,
    numero_documento: '001-001-1000001',
    unidad_id: unidad0.id,
    unidad_abreviatura: unidad0.abreviatura,
    unidad_descripcion: unidad0.descripcion,
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
    foto_documento: null,
    orden_carga_id: 2,
  },
];
