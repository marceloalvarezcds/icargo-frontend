import { mockMonedaList, Moneda } from './moneda';
import { mockProveedorList, Proveedor } from './proveedor';
import { mockTipoConceptoDescuentoList, TipoConceptoDescuento } from './tipo-concepto-descuento';

export interface FleteDescuento {
  id?: number | null;
  concepto_id: number;
  concepto: TipoConceptoDescuento
  detalle?: string | null;
  habilitar_pago_proveedor: boolean;
  anticipado: boolean;
  // INICIO Monto a pagar al Propietario
  propietario_monto?: number | null;
  propietario_moneda_id?: number | null;
  propietario_moneda: Moneda | null;
  // FIN Monto a pagar al Propietario
  // INICIO Monto a pagar al Proveedor
  proveedor_monto?: number | null;
  proveedor_moneda_id?: number | null;
  proveedor_moneda: Moneda | null;
  proveedor_id?: number | null;
  proveedor?: Proveedor | null;
  // FIN Monto a pagar al Proveedor
  flete_id: number;
}

const moneda0 =  mockMonedaList[0];
const moneda1 =  mockMonedaList[1];

const proveedor0 = mockProveedorList[0];
const proveedor1 = mockProveedorList[1];

const tipoConceptoDescuento0 = mockTipoConceptoDescuentoList[0];
const tipoConceptoDescuento1 = mockTipoConceptoDescuentoList[1];

export const mockFleteDescuentoList: FleteDescuento[] = [
  {
    id: 1,
    concepto_id: tipoConceptoDescuento0.id,
    concepto: tipoConceptoDescuento0,
    detalle: 'Flete Descuento Detalle 1',
    habilitar_pago_proveedor: true,
    anticipado: true,
    // INICIO Monto a pagar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda0.id,
    propietario_moneda: moneda0,
    // FIN Monto a pagar al Propietario
    // INICIO Monto a pagar al Proveedor
    proveedor_monto: 100,
    proveedor_moneda_id: moneda0.id,
    proveedor_moneda: moneda0,
    proveedor_id: proveedor0.id,
    proveedor: proveedor0,
    // FIN Monto a pagar al Proveedor
    flete_id: 1,
  },
  {
    id: 2,
    concepto_id: tipoConceptoDescuento1.id,
    concepto: tipoConceptoDescuento1,
    detalle: 'Flete Descuento Detalle 2',
    habilitar_pago_proveedor: true,
    anticipado: true,
    // INICIO Monto a pagar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda1.id,
    propietario_moneda: moneda1,
    // FIN Monto a pagar al Propietario
    // INICIO Monto a pagar al Proveedor
    proveedor_monto: 100,
    proveedor_moneda_id: moneda1.id,
    proveedor_moneda: moneda1,
    proveedor_id: proveedor1.id,
    proveedor: proveedor1,
    // FIN Monto a pagar al Proveedor
    flete_id: 1,
  },
];
