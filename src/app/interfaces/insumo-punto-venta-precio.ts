import { EstadoEnum } from 'src/app/enums/estado-enum';

export interface InsumoPuntoVentaPrecioForm {
  id?: number | null;
  tipo_id: number;
  insumo_id: number;
  proveedor_id: number;
  punto_venta_id: number;
  moneda_id: number;
  precio: number;
  fecha_inicio: string;
  fecha_fin: string;
  observacion: string;
}

export interface InsumoPuntoVentaPrecio {
  id: number;
  precio: number;
  fecha_precio: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at_insumo: string;
  hora_inicio: string;
  observacion: string;
  estado: EstadoEnum;
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
  insumo_moneda_simbolo: string;
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
  punto_venta_direccion: string | null;
  punto_venta_logo: string | null;
  punto_venta_latitud: number | null;
  punto_venta_longitud: number | null;
  proveedor_documento: string;
  created_by: string;
  created_at_insumo: string;
  hora_inicio: string;
  observacion: string;
  marca_insumo: string;
}


export const mockInsumoPuntoVentaPrecio1: InsumoPuntoVentaPrecio = {
  id: 1,
  precio: 1,
  fecha_precio: '2021-11-30T20:38:09.553757',
  fecha_inicio: '2021-11-30T20:38:09.553757',
  fecha_fin: '2021-11-30T20:38:09.553757',
  created_at_insumo: '2021-11-30T20:38:09.553757',
  hora_inicio: '09:30:00',
  observacion: 'observacion',
  estado: EstadoEnum.CANCELADO,
};

export const mockInsumoPuntoVentaPrecio2: InsumoPuntoVentaPrecio = {
  id: 2,
  precio: 100,
  fecha_precio: '2021-11-30T20:38:09.553757',
  fecha_inicio: '2021-11-30T20:38:09.553757',
  fecha_fin: '2021-11-30T20:38:09.553757',
  created_at_insumo: '2021-11-30T20:38:09.553757',
  hora_inicio: '09:30:00',
  observacion: 'observacion',
  estado: EstadoEnum.CANCELADO,
};

export const mockInsumoPuntoVentaPrecio3: InsumoPuntoVentaPrecio = {
  id: 3,
  precio: 1000,
  fecha_precio: '2021-11-30T20:38:09.553757',
  fecha_inicio: '2021-11-30T20:38:09.553757',
  fecha_fin: '2021-11-30T20:38:09.553757',
  created_at_insumo: '2021-11-30T20:38:09.553757',
  hora_inicio: '09:30:00',
  observacion: 'observacion',
  estado: EstadoEnum.CANCELADO,
};
