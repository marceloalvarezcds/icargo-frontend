import { mockGestorCargaList } from './gestor-carga';
import { mockUnidadList } from './unidad';

export interface OrdenCargaRemisionDestinoForm {
  numero_documento: string;
  fecha: string;
  cantidad: number;
  unidad_id: number;
  foto_documento?: string | null;
  numero_documento_origen?: string | null;
  destino_id?: number | null;
  orden_carga_id: number;
}

export interface OrdenCargaRemisionDestino
  extends OrdenCargaRemisionDestinoForm {
  id: number;
  unidad_abreviatura: string;
  unidad_descripcion: string;
  destino_nombre?: string | null;
  gestor_carga_moneda_nombre: string;
  lugar_descarga: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

const gestor0 = mockGestorCargaList[0];
const gestor1 = mockGestorCargaList[0];
const gestor2 = mockGestorCargaList[0];

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];
const unidad2 = mockUnidadList[2];

export const mockOrdenCargaRemisionDestinoList: OrdenCargaRemisionDestino[] = [
  {
    id: 1,
    cantidad: 1000,
    numero_documento: '001-001-1000001',
    fecha: '2021-11-30T20:38:09.553757',
    unidad_id: unidad0.id,
    unidad_abreviatura: unidad0.abreviatura,
    unidad_descripcion: unidad0.descripcion,
    numero_documento_origen: null,
    destino_id: null,
    foto_documento: 'foto',
    orden_carga_id: 1,
    lugar_descarga: 'cargil',
    gestor_carga_moneda_nombre: gestor0.moneda_nombre,
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    cantidad: 1000,
    numero_documento: '001-001-1000002',
    fecha: '2021-11-30T20:38:09.553757',
    unidad_id: unidad1.id,
    unidad_abreviatura: unidad1.abreviatura,
    unidad_descripcion: unidad1.descripcion,
    numero_documento_origen: null,
    foto_documento: null,
    orden_carga_id: 1,
    lugar_descarga: 'cargil',
    gestor_carga_moneda_nombre: gestor1.moneda_nombre,
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    cantidad: 1000,
    numero_documento: '001-001-1000003',
    fecha: '2021-11-30T20:38:09.553757',
    unidad_id: unidad2.id,
    unidad_abreviatura: unidad2.abreviatura,
    unidad_descripcion: unidad2.descripcion,
    numero_documento_origen: null,
    foto_documento: null,
    lugar_descarga: 'cargil',
    orden_carga_id: 2,
    gestor_carga_moneda_nombre: gestor2.moneda_nombre,
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
