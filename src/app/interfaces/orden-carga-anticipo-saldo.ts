import { mockFleteAnticipoList } from './flete-anticipo';

export interface OrdenCargaAnticipoSaldoForm {
  flete_anticipo_id: number;
  orden_carga_id: number;
  total_anticipo: number;
  total_complemento: number;
  total_retirado: number;
  saldo: number;
}

export interface OrdenCargaAnticipoSaldo extends OrdenCargaAnticipoSaldoForm {
  id: number;
  cantidad_nominada: number;
  concepto: string;
  porcentaje: number;
  total_disponible: number;
  flete_anticipo_id_property: number;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

const fleteAnticipo0 = mockFleteAnticipoList[0];
const fleteAnticipo1 = mockFleteAnticipoList[1];
const fleteAnticipo2 = mockFleteAnticipoList[2];

export const mockOrdenCargaAnticipoSaldoList: OrdenCargaAnticipoSaldo[] = [
  {
    id: 1,
    flete_anticipo_id: fleteAnticipo0.id!,
    orden_carga_id: 1,
    total_anticipo: 300,
    total_complemento: 100,
    total_retirado: 100,
    saldo: 200,
    cantidad_nominada: 2000,
    concepto: fleteAnticipo0.tipo_descripcion,
    porcentaje: 10,
    total_disponible: 300,
    flete_anticipo_id_property: 1,
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    flete_anticipo_id: fleteAnticipo1.id!,
    orden_carga_id: 1,
    total_anticipo: 200,
    total_complemento: 100,
    total_retirado: 100,
    saldo: 100,
    cantidad_nominada: 2000,
    concepto: fleteAnticipo1.tipo_insumo_descripcion!,
    porcentaje: 10,
    total_disponible: 300,
    flete_anticipo_id_property: 1,
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    flete_anticipo_id: fleteAnticipo2.id!,
    orden_carga_id: 1,
    total_anticipo: 200,
    total_complemento: 100,
    total_retirado: 100,
    saldo: 100,
    cantidad_nominada: 2000,
    concepto: fleteAnticipo2.tipo_insumo_descripcion!,
    porcentaje: 10,
    total_disponible: 300,
    flete_anticipo_id_property: 1,

    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
