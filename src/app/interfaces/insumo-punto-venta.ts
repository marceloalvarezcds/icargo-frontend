import { EstadoEnum } from 'src/app/enums/estado-enum';
import { mockGestorCargaList } from './gestor-carga';
import { mockInsumoList } from './insumo';
import { InsumoPuntoVentaPrecio, mockInsumoPuntoVentaPrecio1, mockInsumoPuntoVentaPrecio2, mockInsumoPuntoVentaPrecio3 } from './insumo-punto-venta-precio';
import { mockMonedaList } from './moneda';
import { mockPuntoVentaList } from './punto-venta';

export interface InsumoPuntoVenta {
  id: number;
  insumo_id: number;
  insumo_descripcion: string;
  insumo_tipo_descripcion: string;
  insumo_unidad_abreviatura?: string | null;
  insumo_unidad_descripcion?: string | null;
  proveedor_id: number;
  punto_venta_id: number;
  punto_venta_nombre: string;
  moneda_id: number;
  moneda_nombre: string;
  estado: EstadoEnum;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  precios: InsumoPuntoVentaPrecio[];
  precio: number;
  proveedor_nombre: string;
  proveedor_documento: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

const gestor0 = mockGestorCargaList[0];
const gestor1 = mockGestorCargaList[1];

const insumo0 = mockInsumoList[0];
const insumo1 = mockInsumoList[1];

const moneda0 = mockMonedaList[0];
const moneda1 = mockMonedaList[1];
const moneda2 = mockMonedaList[2];

const puntoVenta0 = mockPuntoVentaList[0];
const puntoVenta1 = mockPuntoVentaList[1];
const puntoVenta2 = mockPuntoVentaList[2];

export const mockInsumoPuntoVentaList: InsumoPuntoVenta[] = [
  {
    id: 1,
    insumo_id: insumo0.id,
    insumo_descripcion: insumo0.descripcion,
    insumo_tipo_descripcion: insumo0.tipo_descripcion,
    insumo_unidad_abreviatura: null,
    insumo_unidad_descripcion: null,
    proveedor_id: puntoVenta0.proveedor_id,
    punto_venta_id: puntoVenta0.id,
    punto_venta_nombre: puntoVenta0.nombre,
    moneda_id: moneda0.id,
    moneda_nombre: moneda0.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor0.id,
    gestor_carga_nombre: gestor0.nombre,
    precios: [mockInsumoPuntoVentaPrecio1],
    precio: 2800,
    proveedor_nombre: 'pedro',
    proveedor_documento: '8934545',
    fecha_inicio: '10-20-2023',
    fecha_fin: '10-20-2024',
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    insumo_id: insumo1.id,
    insumo_descripcion: insumo1.descripcion,
    insumo_tipo_descripcion: insumo1.tipo_descripcion,
    insumo_unidad_abreviatura: insumo1.unidad_abreviatura,
    insumo_unidad_descripcion: insumo1.unidad_descripcion,
    proveedor_id: puntoVenta0.proveedor_id,
    punto_venta_id: puntoVenta1.id,
    punto_venta_nombre: puntoVenta1.nombre,
    moneda_id: moneda1.id,
    moneda_nombre: moneda1.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor0.id,
    gestor_carga_nombre: gestor0.nombre,
    precios: [mockInsumoPuntoVentaPrecio2],
    precio: 2800,
    proveedor_nombre: 'pedro',
    proveedor_documento: '8934545',
    fecha_inicio: '10-20-2023',
    fecha_fin: '10-20-2024',
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    insumo_id: insumo1.id,
    insumo_descripcion: insumo1.descripcion,
    insumo_tipo_descripcion: insumo1.tipo_descripcion,
    insumo_unidad_abreviatura: insumo1.unidad_abreviatura,
    insumo_unidad_descripcion: insumo1.unidad_descripcion,
    proveedor_id: puntoVenta0.proveedor_id,
    punto_venta_id: puntoVenta2.id,
    punto_venta_nombre: puntoVenta2.nombre,
    moneda_id: moneda2.id,
    moneda_nombre: moneda2.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor1.id,
    gestor_carga_nombre: gestor1.nombre,
    precios: [mockInsumoPuntoVentaPrecio3],
    precio: 2800,
    proveedor_nombre: 'pedro',
    proveedor_documento: '8934545',
    fecha_inicio: '10-20-2023',
    fecha_fin: '10-20-2024',
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
