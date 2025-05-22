import { mockMonedaList, Moneda } from './moneda';
import { mockTipoConceptoComplementoList, TipoConceptoComplemento } from './tipo-concepto-complemento';

export interface FleteComplemento {
  id?: number | null;
  concepto_id: number;
  concepto: TipoConceptoComplemento;
  concepto_descripcion: string;
  detalle?: string | null;
  habilitar_cobro_remitente: boolean;
  anticipado: boolean;
  // INICIO Monto a pagar al Propietario
  propietario_monto?: number | null;
  propietario_monto_ml?: number | null;
  propietario_moneda_id?: number | null;
  propietario_moneda: Moneda | null;
  propietario_moneda_nombre: string | null;
  // FIN Monto a pagar al Propietario
  // INICIO Monto a cobrar al Remitente
  remitente_monto?: number | null;
  remitente_monto_ml?: number | null,
  remitente_moneda_id?: number | null;
  remitente_moneda?: Moneda | null;
  remitente_moneda_nombre?: string | null;
  // FIN Monto a cobrar al Remitente
  flete_id?: number;

}

const tipoConceptoComplemento0 = mockTipoConceptoComplementoList[0];
const tipoConceptoComplemento1 = mockTipoConceptoComplementoList[1];

const moneda0 =  mockMonedaList[0];
const moneda1 =  mockMonedaList[1];

export const mockFleteComplementoList: FleteComplemento[] = [
  {
    id: 1,
    concepto_id: tipoConceptoComplemento0.id,
    concepto: tipoConceptoComplemento0,
    concepto_descripcion: tipoConceptoComplemento0.descripcion,
    detalle: 'Flete Complemento Detalle 1',
    habilitar_cobro_remitente: true,
    anticipado: true,
    // INICIO Monto a pagar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda0.id,
    propietario_moneda: moneda0,
    propietario_moneda_nombre: moneda0.nombre,
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    remitente_monto: 100,
    remitente_moneda_id: moneda0.id,
    remitente_moneda: moneda0,
    remitente_moneda_nombre: moneda0.nombre,
    // FIN Monto a cobrar al Remitente
    flete_id: 1,
  },
  {
    id: 2,
    concepto_id: tipoConceptoComplemento1.id,
    concepto: tipoConceptoComplemento1,
    concepto_descripcion: tipoConceptoComplemento1.descripcion,
    detalle: 'Flete Complemento Detalle 2',
    habilitar_cobro_remitente: true,
    anticipado: false,
    // INICIO Monto a pagar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda1.id,
    propietario_moneda: moneda1,
    propietario_moneda_nombre: moneda1.nombre,
    // FIN Monto a pagar al Propietario
    // INICIO Monto a cobrar al Remitente
    remitente_monto: 100,
    remitente_moneda_id: moneda1.id,
    remitente_moneda: moneda1,
    remitente_moneda_nombre: moneda1.nombre,
    // FIN Monto a cobrar al Remitente
    flete_id: 1,
  },
];
