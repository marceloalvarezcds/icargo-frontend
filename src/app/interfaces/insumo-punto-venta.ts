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
  punto_venta_id: number;
  punto_venta_nombre: string;
  moneda_id: number;
  moneda_nombre: string;
  estado: EstadoEnum;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  precios: InsumoPuntoVentaPrecio[];
}

const gestor0 = mockGestorCargaList[0];
const gestor1 = mockGestorCargaList[1];

const insumo0 = mockInsumoList[0];
const insumo1 = mockInsumoList[1];
const insumo2 = mockInsumoList[2];

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
    punto_venta_id: puntoVenta0.id,
    punto_venta_nombre: puntoVenta0.nombre,
    moneda_id: moneda0.id,
    moneda_nombre: moneda0.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor0.id,
    gestor_carga_nombre: gestor0.nombre,
    precios: [mockInsumoPuntoVentaPrecio1],
  },
  {
    id: 2,
    insumo_id: insumo1.id,
    insumo_descripcion: insumo1.descripcion,
    insumo_tipo_descripcion: insumo1.tipo_descripcion,
    insumo_unidad_abreviatura: insumo1.unidad_abreviatura,
    insumo_unidad_descripcion: insumo1.unidad_descripcion,
    punto_venta_id: puntoVenta1.id,
    punto_venta_nombre: puntoVenta1.nombre,
    moneda_id: moneda1.id,
    moneda_nombre: moneda1.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor1.id,
    gestor_carga_nombre: gestor1.nombre,
    precios: [mockInsumoPuntoVentaPrecio2],
  },
  {
    id: 3,
    insumo_id: insumo2.id,
    insumo_descripcion: insumo2.descripcion,
    insumo_tipo_descripcion: insumo2.tipo_descripcion,
    insumo_unidad_abreviatura: insumo2.unidad_abreviatura,
    insumo_unidad_descripcion: insumo2.unidad_descripcion,
    punto_venta_id: puntoVenta2.id,
    punto_venta_nombre: puntoVenta2.nombre,
    moneda_id: moneda2.id,
    moneda_nombre: moneda2.nombre,
    estado: EstadoEnum.ACTIVO,
    gestor_carga_id: gestor0.id,
    gestor_carga_nombre: gestor0.nombre,
    precios: [mockInsumoPuntoVentaPrecio3],
  },
];
