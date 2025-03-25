import { mockFleteAnticipoList } from './flete-anticipo';
import { mockInsumoPuntoVentaList } from './insumo-punto-venta';
import {
  mockInsumoPuntoVentaPrecio1,
  mockInsumoPuntoVentaPrecio2,
  mockInsumoPuntoVentaPrecio3,
} from './insumo-punto-venta-precio';
import { mockMonedaList } from './moneda';
import { mockPuntoVentaList } from './punto-venta';
import { mockTipoComprobanteList } from './tipo-comprobante';
import { mockUnidadList } from './unidad';

export interface OrdenCargaAnticipoRetiradoForm {
  flete_anticipo_id: number;
  orden_carga_id: number;
  punto_venta_id: number;
  tipo_comprobante_id: number;
  numero_comprobante: string | null;
  moneda_id: number;
  monto_retirado: number;
  monto_litro: number;
  observacion?: string | null;
  insumo_punto_venta_precio_id?: number | null;
  unidad_id?: number | null;
  cantidad_retirada?: number | null;
  precio_unitario?: number | null;
  // campos auxiliares
  concepto: string;
  concepto_detalle: string;
  insumo_id?: number | null;
  proveedor_id: number;
  tipo_anticipo_id: number;
  tipo_insumo_id?: number | null;
}

export interface OrdenCargaAnticipoRetirado
  extends OrdenCargaAnticipoRetiradoForm {
  id: number;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  gestor_carga_moneda_nombre: string;
  insumo_descripcion?: string | null;
  insumo_fecha_precio?: string | null;
  insumo_moneda_nombre?: string | null;
  insumo_precio?: number | null;
  insumo_tipo_descripcion?: string;
  insumo_unidad_abreviatura?: string | null;
  insumo_unidad_descripcion?: string | null;
  moneda_nombre: string;
  proveedor_nombre: string;
  punto_venta_nombre: string;
  punto_venta_alias: string;
  punto_venta_pais_nombre: string | null;
  tipo_anticipo_descripcion: string;
  tipo_comprobante_descripcion: string;
  tipo_insumo_descripcion?: string | null;
  unidad_abreviatura?: string | null;
  unidad_descripcion?: string | null;
  estados_movimientos?: string | null;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;

}



const fleteAnticipo0 = mockFleteAnticipoList[0];
const fleteAnticipo1 = mockFleteAnticipoList[1];
const fleteAnticipo2 = mockFleteAnticipoList[2];

const moneda0 = mockMonedaList[0];
const moneda1 = mockMonedaList[1];
const moneda2 = mockMonedaList[2];

const insumoPuntoVenta0 = mockInsumoPuntoVentaList[0];
const insumoPuntoVenta1 = mockInsumoPuntoVentaList[1];
const insumoPuntoVenta2 = mockInsumoPuntoVentaList[2];

const puntoVenta0 = mockPuntoVentaList[0];
const puntoVenta1 = mockPuntoVentaList[1];
const puntoVenta2 = mockPuntoVentaList[2];

const unidad0 = mockUnidadList[0];
const unidad1 = mockUnidadList[1];
const unidad2 = mockUnidadList[2];

const tipoComprobante0 = mockTipoComprobanteList[0];
const tipoComprobante1 = mockTipoComprobanteList[1];
const tipoComprobante2 = mockTipoComprobanteList[2];

export const mockOrdenCargaAnticipoRetiradoList: OrdenCargaAnticipoRetirado[] =
  [
    {
      id: 1,
      flete_anticipo_id: fleteAnticipo0.id!,
      punto_venta_id: puntoVenta0.id,
      punto_venta_nombre: puntoVenta0.nombre,
      punto_venta_pais_nombre: puntoVenta0.pais_nombre,
      proveedor_nombre: puntoVenta0.proveedor_nombre,
      punto_venta_alias: 'Ayolas',
      insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio1.id,
      insumo_fecha_precio: mockInsumoPuntoVentaPrecio1.fecha_precio,
      insumo_precio: mockInsumoPuntoVentaPrecio1.precio,
      insumo_descripcion: insumoPuntoVenta0.insumo_descripcion,
      insumo_moneda_nombre: insumoPuntoVenta0.moneda_nombre,
      insumo_tipo_descripcion: insumoPuntoVenta0.insumo_tipo_descripcion,
      insumo_unidad_abreviatura: insumoPuntoVenta0.insumo_unidad_abreviatura,
      insumo_unidad_descripcion: insumoPuntoVenta0.insumo_unidad_descripcion,
      orden_carga_id: 1,
      tipo_anticipo_descripcion: fleteAnticipo0.tipo_descripcion,
      tipo_comprobante_id: tipoComprobante0.id,
      tipo_comprobante_descripcion: tipoComprobante0.descripcion,
      tipo_insumo_descripcion: fleteAnticipo0.tipo_insumo_descripcion,
      numero_comprobante: '001-001-100001',
      moneda_id: moneda0.id,
      moneda_nombre: moneda0.nombre,
      monto_retirado: 100,
      monto_litro: 100,
      observacion: null,
      unidad_id: unidad0.id,
      unidad_abreviatura: unidad0.abreviatura,
      unidad_descripcion: unidad0.descripcion,
      cantidad_retirada: null,
      precio_unitario: null,
      gestor_carga_id: insumoPuntoVenta0.gestor_carga_id,
      gestor_carga_nombre: insumoPuntoVenta0.gestor_carga_nombre,
      gestor_carga_moneda_nombre: insumoPuntoVenta0.moneda_nombre,
      // campos auxiliares
      concepto: fleteAnticipo0.concepto,
      concepto_detalle: fleteAnticipo0.concepto,
      insumo_id: insumoPuntoVenta0.insumo_id,
      proveedor_id: insumoPuntoVenta0.proveedor_id,
      tipo_anticipo_id: fleteAnticipo0.tipo_id,
      tipo_insumo_id: fleteAnticipo0.tipo_insumo_id,
      // Auditoría
      created_by: 'system',
      created_at: '2021-11-30T20:38:09.553757',
      modified_by: 'system',
      modified_at: '2021-11-30T20:38:09.553757',
    },
    {
      id: 2,
      flete_anticipo_id: fleteAnticipo1.id!,
      punto_venta_id: puntoVenta1.id,
      punto_venta_nombre: puntoVenta1.nombre,
      punto_venta_alias: 'Petropar',
      punto_venta_pais_nombre: puntoVenta1.pais_nombre,
      proveedor_nombre: puntoVenta1.proveedor_nombre,
      insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio2.id,
      insumo_fecha_precio: mockInsumoPuntoVentaPrecio2.fecha_precio,
      insumo_precio: mockInsumoPuntoVentaPrecio2.precio,
      insumo_descripcion: insumoPuntoVenta1.insumo_descripcion,
      insumo_moneda_nombre: insumoPuntoVenta1.moneda_nombre,
      insumo_tipo_descripcion: insumoPuntoVenta1.insumo_tipo_descripcion,
      insumo_unidad_abreviatura: insumoPuntoVenta1.insumo_unidad_abreviatura,
      insumo_unidad_descripcion: insumoPuntoVenta1.insumo_unidad_descripcion,
      orden_carga_id: 1,
      tipo_anticipo_descripcion: fleteAnticipo1.tipo_descripcion,
      tipo_comprobante_id: tipoComprobante1.id,
      tipo_comprobante_descripcion: tipoComprobante1.descripcion,
      tipo_insumo_descripcion: fleteAnticipo1.tipo_insumo_descripcion,
      numero_comprobante: '001-001-100002',
      moneda_id: moneda1.id,
      moneda_nombre: moneda1.nombre,
      monto_retirado: 200,
      monto_litro: 100,
      observacion: null,
      unidad_id: unidad1.id,
      unidad_abreviatura: unidad1.abreviatura,
      unidad_descripcion: unidad1.descripcion,
      cantidad_retirada: null,
      precio_unitario: null,
      gestor_carga_id: insumoPuntoVenta1.gestor_carga_id,
      gestor_carga_nombre: insumoPuntoVenta1.gestor_carga_nombre,
      gestor_carga_moneda_nombre: insumoPuntoVenta1.moneda_nombre,
      // campos auxiliares
      concepto: fleteAnticipo1.concepto,
      concepto_detalle: fleteAnticipo0.concepto,
      insumo_id: insumoPuntoVenta1.insumo_id,
      proveedor_id: insumoPuntoVenta1.proveedor_id,
      tipo_anticipo_id: fleteAnticipo1.tipo_id,
      tipo_insumo_id: fleteAnticipo1.tipo_insumo_id,
      // Auditoría
      created_by: 'system',
      created_at: '2021-11-30T20:38:09.553757',
      modified_by: 'system',
      modified_at: '2021-11-30T20:38:09.553757',
    },
    {
      id: 3,
      flete_anticipo_id: fleteAnticipo2.id!,
      punto_venta_id: puntoVenta2.id,
      punto_venta_nombre: puntoVenta2.nombre,
      punto_venta_alias: 'algo',
      punto_venta_pais_nombre: puntoVenta2.pais_nombre,
      proveedor_nombre: puntoVenta2.proveedor_nombre,
      insumo_punto_venta_precio_id: mockInsumoPuntoVentaPrecio3.id,
      insumo_fecha_precio: mockInsumoPuntoVentaPrecio3.fecha_precio,
      insumo_precio: mockInsumoPuntoVentaPrecio3.precio,
      insumo_descripcion: insumoPuntoVenta2.insumo_descripcion,
      insumo_moneda_nombre: insumoPuntoVenta2.moneda_nombre,
      insumo_tipo_descripcion: insumoPuntoVenta2.insumo_tipo_descripcion,
      insumo_unidad_abreviatura: insumoPuntoVenta2.insumo_unidad_abreviatura,
      insumo_unidad_descripcion: insumoPuntoVenta2.insumo_unidad_descripcion,
      orden_carga_id: 2,
      tipo_anticipo_descripcion: fleteAnticipo2.tipo_descripcion,
      tipo_comprobante_id: tipoComprobante2.id,
      tipo_comprobante_descripcion: tipoComprobante2.descripcion,
      tipo_insumo_descripcion: fleteAnticipo2.tipo_insumo_descripcion,
      numero_comprobante: '001-001-100003',
      moneda_id: moneda2.id,
      moneda_nombre: moneda2.nombre,
      monto_retirado: 300,
      monto_litro: 100,
      observacion: null,
      unidad_id: unidad2.id,
      unidad_abreviatura: unidad2.abreviatura,
      unidad_descripcion: unidad2.descripcion,
      cantidad_retirada: null,
      precio_unitario: null,
      gestor_carga_id: insumoPuntoVenta2.gestor_carga_id,
      gestor_carga_nombre: insumoPuntoVenta2.gestor_carga_nombre,
      gestor_carga_moneda_nombre: insumoPuntoVenta1.moneda_nombre,
      // campos auxiliares
      concepto: fleteAnticipo2.concepto,
      concepto_detalle: fleteAnticipo0.concepto,
      insumo_id: insumoPuntoVenta2.insumo_id,
      proveedor_id: insumoPuntoVenta2.proveedor_id,
      tipo_anticipo_id: fleteAnticipo2.tipo_id,
      tipo_insumo_id: fleteAnticipo2.tipo_insumo_id,
      // Auditoría
      created_by: 'system',
      created_at: '2021-11-30T20:38:09.553757',
      modified_by: 'system',
      modified_at: '2021-11-30T20:38:09.553757',
    },
  ];
