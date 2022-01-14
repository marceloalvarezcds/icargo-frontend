import { mockMonedaList, Moneda } from './moneda';
import { mockProveedorList, Proveedor } from './proveedor';
import { mockTipoConceptoDescuentoList, TipoConceptoDescuento } from './tipo-concepto-descuento';

export interface OrdenCargaDescuentoForm {
  id?: number | null;
  concepto_id: number;
  detalle?: string | null;
  habilitar_pago_proveedor: boolean;
  anticipado: boolean;
  // INICIO Monto a cobrar al Propietario
  propietario_monto?: number | null;
  propietario_moneda_id?: number | null;
  // FIN Monto a cobrar al Propietario
  // INICIO Monto a pagar al Proveedor
  proveedor_monto?: number | null;
  proveedor_moneda_id?: number | null;
  proveedor_id?: number | null;
  // FIN Monto a pagar al Proveedor
  orden_carga_id: number;
}

export interface OrdenCargaDescuento extends OrdenCargaDescuentoForm {
  id: number;
  concepto: TipoConceptoDescuento;
  concepto_descripcion: string;
  anticipado_descripcion: string;
  // INICIO Monto a cobrar al Propietario
  propietario_moneda: Moneda;
  propietario_moneda_nombre: string;
  // FIN Monto a cobrar al Propietario
  // INICIO Monto a pagar al Proveedor
  proveedor_moneda?: | null;
  proveedor_moneda_nombre?: string | null;
  proveedor?: Proveedor | null;
  proveedor_nombre?: string | null;
  // FIN Monto a pagar al Proveedor
  flete_id?: number | null;
}

const moneda0 =  mockMonedaList[0];
const moneda1 =  mockMonedaList[1];

const proveedor0 = mockProveedorList[0];
const proveedor1 = mockProveedorList[1];

const tipoConceptoDescuento0 = mockTipoConceptoDescuentoList[0];
const tipoConceptoDescuento1 = mockTipoConceptoDescuentoList[1];

export const mockOrdenCargaDescuentoList: OrdenCargaDescuento[] = [
  {
    id: 1,
    concepto_id: tipoConceptoDescuento0.id,
    concepto: tipoConceptoDescuento0,
    concepto_descripcion: tipoConceptoDescuento0.descripcion,
    detalle: 'Flete Descuento Detalle 1',
    habilitar_pago_proveedor: true,
    anticipado: true,
    anticipado_descripcion: 'Si',
    // INICIO Monto a cobrar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda0.id,
    propietario_moneda: moneda0,
    propietario_moneda_nombre: moneda0.nombre,
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    proveedor_monto: 100,
    proveedor_moneda_id: moneda0.id,
    proveedor_moneda_nombre: moneda0.nombre,
    proveedor_id: proveedor0.id,
    proveedor: proveedor0,
    proveedor_nombre: proveedor0.nombre,
    // FIN Monto a pagar al Proveedor
    orden_carga_id: 1,
    flete_id: 1,
  },
  {
    id: 2,
    concepto_id: tipoConceptoDescuento1.id,
    concepto: tipoConceptoDescuento1,
    concepto_descripcion: tipoConceptoDescuento1.descripcion,
    detalle: 'Flete Descuento Detalle 2',
    habilitar_pago_proveedor: true,
    anticipado: false,
    anticipado_descripcion: 'No',
    // INICIO Monto a cobrar al Propietario
    propietario_monto: 100,
    propietario_moneda_id: moneda1.id,
    propietario_moneda: moneda1,
    propietario_moneda_nombre: moneda1.nombre,
    // FIN Monto a cobrar al Propietario
    // INICIO Monto a pagar al Proveedor
    proveedor_monto: 100,
    proveedor_moneda_id: moneda1.id,
    proveedor_moneda_nombre: moneda1.nombre,
    proveedor_id: proveedor1.id,
    proveedor: proveedor1,
    proveedor_nombre: proveedor1.nombre,
    // FIN Monto a pagar al Proveedor
    orden_carga_id: 1,
    flete_id: 1,
  },
];
