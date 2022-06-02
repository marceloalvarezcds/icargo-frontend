import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface InsumoPuntoVentaPrecioForm {
  id?: number | null;
  tipo_id: number;
  insumo_id: number;
  proveedor_id: number;
  punto_venta_id: number;
  moneda_id: number;
  precio: number;
}

export interface InsumoPuntoVentaPrecio {
  id: number;
  precio: number;
  fecha_precio: string;
}

export interface InsumoPuntoVentaPrecioList extends InsumoPuntoVentaPrecio {
  insumo_punto_venta_id: number;
  estado: EstadoEnum;
  ciudad_nombre: string | null;
  gestor_carga_id: number;
  gestor_carga_nombre: string;
  insumo_id: number;
  insumo_descripcion: string;
  insumo_moneda_id: number;
  insumo_moneda_nombre: string;
  insumo_tipo_id: number;
  insumo_tipo_descripcion: string;
  insumo_unidad_abreviatura?: string | null;
  insumo_unidad_descripcion?: string | null;
  localidad_nombre: string | null;
  pais_nombre: string | null;
  pais_nombre_corto: string | null;
  proveedor_id: number;
  proveedor_nombre: string;
  punto_venta_id: number;
  punto_venta_nombre: string;
}

export const mockInsumoPuntoVentaPrecio1: InsumoPuntoVentaPrecio = {
  id: 1,
  precio: 1,
  fecha_precio: '2021-11-30T20:38:09.553757',
};

export const mockInsumoPuntoVentaPrecio2: InsumoPuntoVentaPrecio = {
  id: 2,
  precio: 100,
  fecha_precio: '2021-11-30T20:38:09.553757',
};

export const mockInsumoPuntoVentaPrecio3: InsumoPuntoVentaPrecio = {
  id: 3,
  precio: 1000,
  fecha_precio: '2021-11-30T20:38:09.553757',
};
