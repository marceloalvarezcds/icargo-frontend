import { EstadoEnum } from 'src/app/enums/estado-enum';
import { LiquidacionEstadoEnum } from 'src/app/enums/liquidacion-estado-enum';
import { LiquidacionEtapaEnum } from 'src/app/enums/liquidacion-etapa-enum';
import { ContraparteInfo } from './contraparte-info';
import { Factura } from './factura';
import { Instrumento } from './instrumento';
import { Moneda } from './moneda';
import { Movimiento } from './movimiento';
import { TipoContraparte } from './tipo-contraparte';

export interface Liquidacion extends ContraparteInfo {
  id: number;
  // IDs para referencia a las tablas de las contraparte
  chofer_id: number | null;
  gestor_carga_id: number | undefined;
  propietario_id: number | null;
  proveedor_id: number | null;
  remitente_id: number | null;
  punto_venta_id?: number ;
  // campos
  moneda_id: number;
  fecha_pago_cobro: string | null;
  estado: LiquidacionEstadoEnum;
  etapa: LiquidacionEtapaEnum;
  moneda: Moneda;
  comentarios: string | null;
  tipo_contraparte: TipoContraparte;
  // Lista
  facturas: Factura[];
  movimientos: Movimiento[];
  instrumentos: Instrumento[];
  // Campos calculados
  credito: number;
  es_cobro: boolean;
  esta_pagado: boolean;
  debito: number;
  instrumentos_saldo: number;
  moneda_nombre: string;
  moneda_simbolo: string;
  movimientos_saldo: number;
  saldo: number;
  saldo_residual: number;
  tipo_operacion_descripcion: string;
  url: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  pago_cobro: number | null;
  monto?: number ;
  user_aprueba?: string;
  aprobado_at?: string;
  es_pago_cobro: string;
  saldo_cc?: number;
  tipo_mov_liquidacion?: string;
}

export const mockLiquidacionList: Liquidacion[] = [
  {
    gestor_carga_id: 1,
    tipo_contraparte_id: 3,
    contraparte: 'ADM SANTA RITA',
    contraparte_numero_documento: '3100100',
    credito: 0,
    debito: -2000000,
    saldo: -2000000,
    movimientos_saldo: -2000000,
    instrumentos_saldo: -100000,
    moneda_id: 1,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: null,
    remitente_id: 1,
    punto_venta_id:0,
    id: 11,
    estado: LiquidacionEstadoEnum.PENDIENTE,
    etapa: LiquidacionEtapaEnum.PENDIENTE,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 3,
      descripcion: 'Remitente',
    },
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    comentarios: '',
    url: '',
    es_cobro: false,
    esta_pagado: false,
    fecha_pago_cobro: null,
    saldo_residual: 100000,
    tipo_contraparte_descripcion: 'Remitente',
    tipo_operacion_descripcion: 'Pago',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
    facturas: [],
    movimientos: [],
    instrumentos: [],
    pago_cobro:0,
    es_pago_cobro:'pago',
  },
  {
    gestor_carga_id: 1,
    tipo_contraparte_id: 1,
    contraparte: 'AGROFERTIL SANTA FE',
    contraparte_numero_documento: '800200200',
    credito: 0,
    debito: -600000,
    saldo: -600000,
    movimientos_saldo: -600000,
    instrumentos_saldo: -75000,
    moneda_id: 1,
    chofer_id: null,
    propietario_id: 6,
    proveedor_id: null,
    remitente_id: null,
    punto_venta_id:0,
    id: 2,
    estado: LiquidacionEstadoEnum.PENDIENTE,
    etapa: LiquidacionEtapaEnum.PENDIENTE,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Propietario',
    },
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    comentarios: '',
    url: '',
    saldo_residual: -75000,
    es_cobro: false,
    esta_pagado: false,
    fecha_pago_cobro: null,
    tipo_contraparte_descripcion: 'Propietario',
    tipo_operacion_descripcion: 'Pago',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:29.516739',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:29.516739',
    facturas: [],
    movimientos: [],
    instrumentos: [],
    pago_cobro:0,
    es_pago_cobro:'pago',
  },
  {
    gestor_carga_id: 1,
    tipo_contraparte_id: 4,
    contraparte: 'GICAL KM12',
    contraparte_numero_documento: 'p-100100',
    credito: 900,
    debito: 0,
    saldo: 900,
    movimientos_saldo: 900,
    instrumentos_saldo: 100,
    moneda_id: 1,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: 2,
    remitente_id: null,
    punto_venta_id:0,
    id: 3,
    estado: LiquidacionEstadoEnum.PENDIENTE,
    etapa: LiquidacionEtapaEnum.PENDIENTE,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 4,
      descripcion: 'Proveedor',
    },
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    comentarios: '',
    url: '',
    saldo_residual: 100,
    es_cobro: true,
    esta_pagado: true,
    fecha_pago_cobro: null,
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.663215',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.663215',
    facturas: [],
    movimientos: [],
    instrumentos: [],
    pago_cobro:0,
    es_pago_cobro:'pago',
  },
  {
    gestor_carga_id: 1,
    tipo_contraparte_id: 1,
    contraparte: 'LA PAZ',
    contraparte_numero_documento: '800100100',
    credito: 1000,
    debito: 0,
    saldo: 1000,
    movimientos_saldo: 10000,
    instrumentos_saldo: 10000,
    moneda_id: 1,
    chofer_id: null,
    propietario_id: 3,
    proveedor_id: null,
    remitente_id: null,
    punto_venta_id:0,
    id: 4,
    estado: LiquidacionEstadoEnum.PENDIENTE,
    etapa: LiquidacionEtapaEnum.PENDIENTE,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Propietario',
    },
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    comentarios: '',
    url: '',
    es_cobro: true,
    esta_pagado: true,
    fecha_pago_cobro: null,
    saldo_residual: 10000,
    tipo_contraparte_descripcion: 'Propietario',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.608139',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.608139',
    facturas: [],
    movimientos: [],
    instrumentos: [],
    pago_cobro:0,
    es_pago_cobro:'pago',
  },
  {
    gestor_carga_id: 1,
    tipo_contraparte_id: 4,
    contraparte: 'LDC_POZUELO',
    contraparte_numero_documento: '800400400',
    credito: 236300,
    debito: 0,
    saldo: 0,
    movimientos_saldo: 236300,
    instrumentos_saldo: 236300,
    moneda_id: 1,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: 12,
    remitente_id: null,
    punto_venta_id:0,
    id: 5,
    estado: LiquidacionEstadoEnum.PENDIENTE,
    etapa: LiquidacionEtapaEnum.PENDIENTE,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 4,
      descripcion: 'Proveedor',
    },
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    comentarios: '',
    url: '',
    es_cobro: true,
    esta_pagado: true,
    fecha_pago_cobro: null,
    saldo_residual: 0,
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
    facturas: [],
    movimientos: [],
    instrumentos: [],
    pago_cobro:0,
    es_pago_cobro:'pago',
  },
];

export const mockLiquidacion1: Liquidacion = mockLiquidacionList[0];
export const mockLiquidacion2: Liquidacion = mockLiquidacionList[1];
