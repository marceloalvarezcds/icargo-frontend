import { EstadoEnum } from 'src/app/enums/estado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { ContraparteInfo } from './contraparte-info';
import { Moneda } from './moneda';
import { TipoContraparte } from './tipo-contraparte';
import { TipoCuenta } from './tipo-cuenta';
import { TipoDocumentoRelacionado } from './tipo-documento-relacionado';
import { TipoMovimiento } from './tipo-movimiento';

export interface MovimientoBaseModel {
  id: number | null;
  gestor_carga_id: number | null;
  liquidacion_id: number | null;
  orden_carga_id: number | null;
  tipo_contraparte_id: number;
  contraparte: string;
  contraparte_numero_documento: string;
  tipo_documento_relacionado_id: number;
  numero_documento_relacionado: number | null;
  cuenta_id: number;
  tipo_movimiento_id: number;
  monto: number;
  moneda_id: number;
  tipo_cambio_moneda: number;
  fecha_cambio_moneda: string;
  fecha: string | null;
  detalle: string | null;
  // En caso de ser movimiento de anticipo
  anticipo_id: number | null;
  // En caso de ser movimiento de complemento o descuento
  complemento_id: number | null;
  descuento_id: number | null;
  // IDs para referencia a las tablas de las contraparte
  chofer_id: number | null;
  propietario_id: number | null;
  proveedor_id: number | null;
  remitente_id: number | null;
}

export interface MovimientoForm extends MovimientoBaseModel {
  es_creacion_contraparte?: boolean;
}

export interface Movimiento extends ContraparteInfo, MovimientoBaseModel {
  id: number;
  gestor_carga_id: number;
  estado: MovimientoEstadoEnum;
  es_editable: boolean;
  tipo_contraparte: TipoContraparte;
  tipo_documento_relacionado: TipoDocumentoRelacionado;
  cuenta: TipoCuenta;
  tipo_movimiento: TipoMovimiento;
  moneda: Moneda;
  // Campos calculados
  credito: number;
  camion_placa: string;
  chofer_nombre: string;
  chofer_numero_documento: string;
  concepto: string;
  cuenta_descripcion: string;
  debito: number;
  destino_nombre: string;
  es_cobro: boolean;
  fecha_pago_cobro: string | null;
  flete_id: number | null;
  insumo_descripcion: string | null;
  liquidacion_fecha: string | null;
  moneda_nombre: string;
  moneda_simbolo: string;
  monto_ml: number;
  origen_nombre: string;
  producto_descripcion: string;
  propietario_nombre: string | null;
  proveedor_nombre: string | null;
  remitente_nombre: string | null;
  remitente_numero_documento: string | null;
  saldo: number;
  semi_placa: string | null;
  tipo_documento_relacionado_descripcion: string;
  tipo_insumo_descripcion: string | null;
  tipo_movimiento_descripcion: string;
  tipo_operacion_descripcion: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockMovimientoList: Movimiento[] = [
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 1,
    tipo_contraparte_id: 3,
    contraparte: 'ADM SANTA RITA',
    contraparte_numero_documento: '3100100',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 1,
    cuenta_id: 1,
    tipo_movimiento_id: 2,
    fecha: '2022-03-16T12:32:14.859823',
    monto: -2100000,
    moneda_id: 1,
    tipo_cambio_moneda: 1,
    fecha_cambio_moneda: '2022-03-16T12:32:14.896867',
    anticipo_id: null,
    complemento_id: null,
    descuento_id: null,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: null,
    remitente_id: 1,
    id: 11,
    estado: MovimientoEstadoEnum.PENDIENTE,
    es_editable: true,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 3,
      descripcion: 'Remitente',
    },
    tipo_documento_relacionado: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'OC',
    },
    cuenta: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Viajes',
    },
    tipo_movimiento: {
      estado: EstadoEnum.ACTIVO,
      id: 2,
      descripcion: 'Flete',
    },
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    credito: 0,
    camion_placa: '1800100100',
    chofer_nombre: 'Chofer Transred 3',
    chofer_numero_documento: '800100100',
    concepto: 'Flete',
    cuenta_descripcion: 'Viajes',
    debito: -2100000,
    destino_nombre: 'LA PAZ',
    detalle: 'P.Dest.: 21.000,00Kg || Tarifa: 100,00PYG/kg.',
    es_cobro: false,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: -2100000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 2100000,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Remitente',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Flete',
    tipo_operacion_descripcion: 'Pago',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 2,
    tipo_contraparte_id: 1,
    contraparte: 'AGROFERTIL SANTA FE',
    contraparte_numero_documento: '800200200',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 2,
    cuenta_id: 1,
    tipo_movimiento_id: 5,
    fecha: '2022-03-16T12:32:14.859823',
    monto: -675000,
    moneda_id: 1,
    tipo_cambio_moneda: 1,
    fecha_cambio_moneda: '2022-03-16T12:34:29.536766',
    anticipo_id: null,
    complemento_id: null,
    descuento_id: null,
    chofer_id: null,
    propietario_id: 6,
    proveedor_id: null,
    remitente_id: null,
    id: 2,
    estado: MovimientoEstadoEnum.PENDIENTE,
    es_editable: false,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Propietario',
    },
    tipo_documento_relacionado: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'OC',
    },
    cuenta: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Viajes',
    },
    tipo_movimiento: {
      estado: EstadoEnum.ACTIVO,
      id: 5,
      descripcion: 'Merma',
    },
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    credito: 0,
    camion_placa: '1800200200',
    chofer_nombre: 'Chofer Transred 6',
    chofer_numero_documento: '800200200',
    concepto: 'Merma',
    cuenta_descripcion: 'Viajes',
    debito: -675000,
    destino_nombre: 'LA PAZ',
    detalle:
      'Dif.: 500,00Kg || Tol.: 50,00Kg || M.: 450,00Kg || Tarifa: 1.500,00Grs/Kg.',
    es_cobro: false,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: -675000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'AGROFERTIL SANTA FE',
    proveedor_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 675000,
    semi_placa: '1800100100',
    tipo_contraparte_descripcion: 'Propietario',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Merma',
    tipo_operacion_descripcion: 'Pago',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:29.516739',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:29.516739',
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 1,
    tipo_contraparte_id: 4,
    contraparte: 'GICAL KM12',
    contraparte_numero_documento: 'p-100100',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 1,
    cuenta_id: 1,
    tipo_movimiento_id: 4,
    fecha: '2022-03-16T12:32:14.859823',
    monto: 900,
    moneda_id: 1,
    tipo_cambio_moneda: 1,
    fecha_cambio_moneda: '2022-03-16T12:32:14.697482',
    anticipo_id: null,
    complemento_id: null,
    descuento_id: 1,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: 2,
    remitente_id: null,
    id: 3,
    estado: MovimientoEstadoEnum.PENDIENTE,
    es_editable: false,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 4,
      descripcion: 'Proveedor',
    },
    tipo_documento_relacionado: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'OC',
    },
    cuenta: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Viajes',
    },
    tipo_movimiento: {
      estado: EstadoEnum.ACTIVO,
      id: 4,
      descripcion: 'Descuento',
    },
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    credito: 900,
    camion_placa: '1800100100',
    chofer_nombre: 'Chofer Transred 3',
    chofer_numero_documento: '800100100',
    concepto: 'Descuento',
    cuenta_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle: 'Monto: 900,00PYG',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 900,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 900,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Descuento',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.663215',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.663215',
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 1,
    tipo_contraparte_id: 1,
    contraparte: 'LA PAZ',
    contraparte_numero_documento: '800100100',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 1,
    cuenta_id: 1,
    tipo_movimiento_id: 3,
    fecha: '2022-03-16T12:32:14.859823',
    monto: 10000,
    moneda_id: 1,
    tipo_cambio_moneda: 1,
    fecha_cambio_moneda: '2022-03-16T12:32:14.644401',
    anticipo_id: null,
    complemento_id: 2,
    descuento_id: null,
    chofer_id: null,
    propietario_id: 3,
    proveedor_id: null,
    remitente_id: null,
    id: 4,
    estado: MovimientoEstadoEnum.PENDIENTE,
    es_editable: false,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Propietario',
    },
    tipo_documento_relacionado: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'OC',
    },
    cuenta: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Viajes',
    },
    tipo_movimiento: {
      estado: EstadoEnum.ACTIVO,
      id: 3,
      descripcion: 'Complemento',
    },
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    credito: 10000,
    camion_placa: '1800100100',
    chofer_nombre: 'Chofer Transred 3',
    chofer_numero_documento: '800100100',
    concepto: 'Complemento',
    cuenta_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle: 'Monto: 10.000,00PYG',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 10000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 10000,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Propietario',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Complemento',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.608139',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.608139',
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 2,
    tipo_contraparte_id: 4,
    contraparte: 'LDC_POZUELO',
    contraparte_numero_documento: '800400400',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 2,
    cuenta_id: 1,
    tipo_movimiento_id: 1,
    fecha: '2022-03-16T12:32:14.859823',
    monto: 236300,
    moneda_id: 1,
    tipo_cambio_moneda: 1,
    fecha_cambio_moneda: '2022-03-16T12:34:16.899030',
    anticipo_id: 3,
    complemento_id: null,
    descuento_id: null,
    chofer_id: null,
    propietario_id: null,
    proveedor_id: 12,
    remitente_id: null,
    id: 5,
    estado: MovimientoEstadoEnum.PENDIENTE,
    es_editable: false,
    tipo_contraparte: {
      estado: EstadoEnum.ACTIVO,
      id: 4,
      descripcion: 'Proveedor',
    },
    tipo_documento_relacionado: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'OC',
    },
    cuenta: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Viajes',
    },
    tipo_movimiento: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      descripcion: 'Anticipo',
    },
    moneda: {
      estado: EstadoEnum.ACTIVO,
      id: 1,
      nombre: 'Guaranies',
      simbolo: 'PYG',
    },
    credito: 236300,
    camion_placa: '1800200200',
    chofer_nombre: 'Chofer Transred 6',
    chofer_numero_documento: '800200200',
    concepto: 'Anticipo',
    cuenta_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle:
      'PDV: COMBUSTIBLE || Monto: 236.300,00PYG || Fecha: 2022-03-16 / 12:34:16',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: 'DIESEL PODIUM',
    liquidacion_fecha: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 236300,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'AGROFERTIL SANTA FE',
    proveedor_nombre: 'LDC_POZUELO',
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 236300,
    semi_placa: '1800100100',
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: 'COMBUSTIBLE',
    tipo_movimiento_descripcion: 'Anticipo',
    tipo_operacion_descripcion: 'Cobro',
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
  },
];

export const mockMovimientoForm1: MovimientoForm = {
  ...mockMovimientoList[0],
  es_creacion_contraparte: false,
};

export const mockMovimientoForm2: MovimientoForm = {
  ...mockMovimientoList[0],
  es_creacion_contraparte: true,
};
