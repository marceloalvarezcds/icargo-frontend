import { mockInsumoPuntoVentaList } from './insumo-punto-venta';
import { mockInsumoPuntoVentaPrecio1, mockInsumoPuntoVentaPrecio2, mockInsumoPuntoVentaPrecio3 } from './insumo-punto-venta-precio';
import { mockMonedaList } from './moneda';
import { mockTipoComprobanteList } from './tipo-comprobantet';
import { mockUnidadList } from './unidad';

export interface OrdenCargaAnticipoForm {
  insumo_punto_venta_precio_id: number;
  orden_carga_id: number;
  tipo_comprobante_id: number;
  numero_comprobante: string;
  moneda_id: number;
  monto_retirado: number;
  observacion?: string | null;
  unidad_id?: number | null;
  cantidad_retirada?: number | null;
  precio_unitario?: number | null;
}

export interface OrdenCargaAnticipo extends OrdenCargaAnticipoForm {
  id: number;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  insumo_descripcion: string;
  insumo_fecha_precio: string;
  insumo_moneda_nombre: string;
  insumo_precio: number;
  insumo_tipo_descripcion: string;
  insumo_unidad_abreviatura?: string | null;
  insumo_unidad_descripcion?: string | null;
  punto_venta_nombre: string;
  moneda_nombre: string;
  tipo_comprobante_descripcion: string;
  unidad_abreviatura?: string | null;
  unidad_descripcion?: string | null;
}

const moneda0 = mockMonedaList[0];
const moneda1 = mockMonedaList[1];
const moneda2 = mockMonedaList[2];

const insumoPuntoVenta0 = mockInsumoPuntoVentaList[0];
const insumoPuntoVenta1 = mockInsumoPuntoVentaList[1];
const insumoPuntoVenta2 = mockInsumoPuntoVentaList[2];

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];
const unidad2 = mockUnidadList[2];

const tipoComprobante0 = mockTipoComprobanteList[0];
const tipoComprobante1 = mockTipoComprobanteList[1];
const tipoComprobante2 = mockTipoComprobanteList[2];

export const mockOrdenCargaAnticipoList: OrdenCargaAnticipo[] = [
  {
    id: 1,
    insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio1.id,
    insumo_fecha_precio: mockInsumoPuntoVentaPrecio1.fecha_precio,
    insumo_precio: mockInsumoPuntoVentaPrecio1.precio,
    insumo_descripcion: insumoPuntoVenta0.insumo_descripcion,
    insumo_moneda_nombre: insumoPuntoVenta0.moneda_nombre,
    insumo_tipo_descripcion: insumoPuntoVenta0.insumo_tipo_descripcion,
    insumo_unidad_abreviatura: insumoPuntoVenta0.insumo_unidad_abreviatura,
    insumo_unidad_descripcion: insumoPuntoVenta0.insumo_unidad_descripcion,
    orden_carga_id: 1,
    tipo_comprobante_id: tipoComprobante0.id,
    tipo_comprobante_descripcion: tipoComprobante0.descripcion,
    numero_comprobante: '001-001-100001',
    moneda_id: moneda0.id,
    moneda_nombre: moneda0.nombre,
    monto_retirado: 100,
    observacion: null,
    unidad_id: unidad0.id,
    unidad_abreviatura: unidad0.abreviatura,
    unidad_descripcion: unidad0.descripcion,
    cantidad_retirada: null,
    precio_unitario: null,
    gestor_carga_id: insumoPuntoVenta0.gestor_carga_id,
    gestor_carga_nombre: insumoPuntoVenta0.gestor_carga_nombre,
    punto_venta_nombre: insumoPuntoVenta0.punto_venta_nombre,
  },
  {
    id: 2,
    insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio2.id,
    insumo_fecha_precio: mockInsumoPuntoVentaPrecio2.fecha_precio,
    insumo_precio: mockInsumoPuntoVentaPrecio2.precio,
    insumo_descripcion: insumoPuntoVenta1.insumo_descripcion,
    insumo_moneda_nombre: insumoPuntoVenta1.moneda_nombre,
    insumo_tipo_descripcion: insumoPuntoVenta1.insumo_tipo_descripcion,
    insumo_unidad_abreviatura: insumoPuntoVenta1.insumo_unidad_abreviatura,
    insumo_unidad_descripcion: insumoPuntoVenta1.insumo_unidad_descripcion,
    orden_carga_id: 1,
    tipo_comprobante_id: tipoComprobante1.id,
    tipo_comprobante_descripcion: tipoComprobante1.descripcion,
    numero_comprobante: '001-001-100002',
    moneda_id: moneda1.id,
    moneda_nombre: moneda1.nombre,
    monto_retirado: 200,
    observacion: null,
    unidad_id: unidad1.id,
    unidad_abreviatura: unidad1.abreviatura,
    unidad_descripcion: unidad1.descripcion,
    cantidad_retirada: null,
    precio_unitario: null,
    gestor_carga_id: insumoPuntoVenta1.gestor_carga_id,
    gestor_carga_nombre: insumoPuntoVenta1.gestor_carga_nombre,
    punto_venta_nombre: insumoPuntoVenta1.punto_venta_nombre,
  },
  {
    id: 3,
    insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio3.id,
    insumo_fecha_precio: mockInsumoPuntoVentaPrecio3.fecha_precio,
    insumo_precio: mockInsumoPuntoVentaPrecio3.precio,
    insumo_descripcion: insumoPuntoVenta2.insumo_descripcion,
    insumo_moneda_nombre: insumoPuntoVenta2.moneda_nombre,
    insumo_tipo_descripcion: insumoPuntoVenta2.insumo_tipo_descripcion,
    insumo_unidad_abreviatura: insumoPuntoVenta2.insumo_unidad_abreviatura,
    insumo_unidad_descripcion: insumoPuntoVenta2.insumo_unidad_descripcion,
    orden_carga_id: 2,
    tipo_comprobante_id: tipoComprobante2.id,
    tipo_comprobante_descripcion: tipoComprobante2.descripcion,
    numero_comprobante: '001-001-100003',
    moneda_id: moneda2.id,
    moneda_nombre: moneda2.nombre,
    monto_retirado: 300,
    observacion: null,
    unidad_id: unidad2.id,
    unidad_abreviatura: unidad2.abreviatura,
    unidad_descripcion: unidad2.descripcion,
    cantidad_retirada: null,
    precio_unitario: null,
    gestor_carga_id: insumoPuntoVenta2.gestor_carga_id,
    gestor_carga_nombre: insumoPuntoVenta2.gestor_carga_nombre,
    punto_venta_nombre: insumoPuntoVenta2.punto_venta_nombre,
  },
];
