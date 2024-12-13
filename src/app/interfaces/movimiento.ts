import { EstadoEnum } from 'src/app/enums/estado-enum';
import { MovimientoEstadoEnum } from 'src/app/enums/movimiento-estado-enum';
import { ContraparteInfo } from './contraparte-info';
import { Moneda } from './moneda';
import {
  mockOrdenCargaAnticipoRetiradoList,
  OrdenCargaAnticipoRetirado,
} from './orden-carga-anticipo-retirado';
import { TipoContraparte } from './tipo-contraparte';
import { mockTipoCuentaList, TipoCuenta } from './tipo-cuenta';
import { TipoDocumentoRelacionado } from './tipo-documento-relacionado';
import { TipoMovimiento, mockTipoMovimientoList } from './tipo-movimiento';

export interface MovimientoBaseModel {
  id: number | null;
  gestor_carga_id: number | null;
  liquidacion_id: number | null;
  orden_carga_id: number | null;
  tipo_contraparte_id: number;
  contraparte_id: number | null;
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
  punto_venta_id?: number;
  es_punto_venta?: boolean;
  linea_movimiento?: string;
}

export interface MovimientoForm extends MovimientoBaseModel {
  es_cobro: boolean;
  es_creacion_contraparte?: boolean;
}

export interface MovimientoFleteEditForm {
  moneda_id: number | null;
  tarifa: number | null;
}

export interface MovimientoMermaEditForm {
  valor: number | null;
  moneda_id: number | null;
  es_porcentual: boolean;
  tolerancia: number | null;
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
  cuenta_codigo_descripcion: string;
  debito: number;
  destino_nombre: string;
  es_cobro: boolean;
  fecha_pago_cobro: string | null;
  flete_id: number | null;
  insumo_descripcion: string | null;
  liquidacion_fecha_creacion: string | null;
  moneda_nombre: string;
  moneda_simbolo: string;
  monto_ml: number;
  origen_nombre: string;
  producto_descripcion: string;
  propietario_nombre: string | null;
  proveedor_nombre: string | null;
  punto_venta_nombre: string | null;
  remitente_nombre: string | null;
  remitente_numero_documento: string | null;
  saldo: number;
  semi_placa: string | null;
  tipo_documento_relacionado_descripcion: string;
  tipo_insumo_descripcion: string | null;
  tipo_movimiento_descripcion: string;
  tipo_operacion_descripcion: string;
  // Datos de la OC
  es_flete: boolean;
  es_gestor: boolean;
  es_merma: boolean;
  es_propietario: boolean;
  can_edit_oc: boolean;
  cantidad_destino: number | null;
  condicion_gestor_carga_moneda_id: number | null;
  condicion_gestor_carga_tarifa: number | null;
  condicion_propietario_moneda_id: number | null;
  condicion_propietario_tarifa: number | null;
  merma_gestor_carga_valor: number | null;
  merma_gestor_carga_moneda_id: number | null;
  merma_gestor_carga_es_porcentual: boolean;
  merma_gestor_carga_tolerancia: number | null;
  merma_propietario_valor: number | null;
  merma_propietario_moneda_id: number | null;
  merma_propietario_es_porcentual: boolean;
  merma_propietario_tolerancia: number | null;
  // En caso de ser movimiento de anticipo
  anticipo: OrdenCargaAnticipoRetirado | null;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
  // Datos de estado de cuenta del MOV
  pendiente: number ;
  confirmado: number ;
  finalizado: number ;
  detalleMovimiento?: string ;
  movimiento_saldo?: number ;
  descuento_concepto?: string;
  complemento_concepto?: string;
  tipo_movimiento_info?: string;
  documento_fisico_oc?: boolean;
}

export interface MovimientoEstadoCuenta {
    movimiento_id: number,
    liquidacion_id: number | null,
    fecha: string | null,
    tipo_cuenta_descripcion: string,
    tipo_movimiento_concepto: string,
    nro_documento_relacionado: 48,
    detalle: string,
    info: string,
    estado: string,
    estado_liquidacion: string,
    es_editable: boolean,
    can_edit_oc: boolean,
    provision: number,
    pendiente: number,
    en_proceso: number,
    confirmado: number,
    finalizado: number,
    movimiento_saldo?: number,
    documento_fisico_oc?: boolean,
}

export const mockMovimientoList: Movimiento[] = [
  {
    gestor_carga_id: 1,
    liquidacion_id: 1,
    orden_carga_id: 1,
    tipo_contraparte_id: 3,
    contraparte_id: 3,
    contraparte: 'ADM SANTA RITA',
    contraparte_numero_documento: '3100100',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 1,
    cuenta_id: 1,
    tipo_movimiento_id: 2,
    fecha: '2022-03-16T12:32:14.859823',
    monto: 2100000,
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
    cuenta: mockTipoCuentaList[0],
    tipo_movimiento: mockTipoMovimientoList[0],
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
    cuenta_codigo_descripcion: 'Viajes',
    debito: 2100000,
    destino_nombre: 'LA PAZ',
    detalle: 'P.Dest.: 21.000,00Kg || Tarifa: 100,00PYG/kg.',
    es_cobro: false,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha_creacion: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 2100000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    punto_venta_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 2100000,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Remitente',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Flete',
    tipo_operacion_descripcion: 'Pago',
    // Datos de la OC
    es_flete: false,
    es_gestor: false,
    es_merma: false,
    es_propietario: false,
    can_edit_oc: false,
    cantidad_destino: 0,
    condicion_gestor_carga_moneda_id: null,
    condicion_gestor_carga_tarifa: null,
    condicion_propietario_moneda_id: null,
    condicion_propietario_tarifa: null,
    merma_gestor_carga_valor: null,
    merma_gestor_carga_moneda_id: null,
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia: null,
    merma_propietario_valor: null,
    merma_propietario_moneda_id: null,
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia: null,
    // En caso de ser movimiento de anticipo
    anticipo: mockOrdenCargaAnticipoRetiradoList[0],
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.859823',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.859823',
    pendiente: 0,
    confirmado: 0,
    finalizado: 0,
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 2,
    tipo_contraparte_id: 1,
    contraparte_id: 1,
    contraparte: 'AGROFERTIL SANTA FE',
    contraparte_numero_documento: '800200200',
    tipo_documento_relacionado_id: 1,
    numero_documento_relacionado: 2,
    cuenta_id: 1,
    tipo_movimiento_id: 5,
    fecha: '2022-03-16T12:32:14.859823',
    monto: 675000,
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
    cuenta: mockTipoCuentaList[1],
    tipo_movimiento: mockTipoMovimientoList[1],
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
    cuenta_codigo_descripcion: 'Viajes',
    debito: 675000,
    destino_nombre: 'LA PAZ',
    detalle:
      'Dif.: 500,00Kg || Tol.: 50,00Kg || M.: 450,00Kg || Tarifa: 1.500,00Grs/Kg.',
    es_cobro: false,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha_creacion: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 675000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'AGROFERTIL SANTA FE',
    proveedor_nombre: null,
    punto_venta_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 675000,
    semi_placa: '1800100100',
    tipo_contraparte_descripcion: 'Propietario',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Merma',
    tipo_operacion_descripcion: 'Pago',
    // Datos de la OC
    es_flete: false,
    es_gestor: false,
    es_merma: false,
    es_propietario: false,
    can_edit_oc: false,
    cantidad_destino: 0,
    condicion_gestor_carga_moneda_id: null,
    condicion_gestor_carga_tarifa: null,
    condicion_propietario_moneda_id: null,
    condicion_propietario_tarifa: null,
    merma_gestor_carga_valor: null,
    merma_gestor_carga_moneda_id: null,
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia: null,
    merma_propietario_valor: null,
    merma_propietario_moneda_id: null,
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia: null,
    // En caso de ser movimiento de anticipo
    anticipo: mockOrdenCargaAnticipoRetiradoList[0],
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:29.516739',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:29.516739',
    pendiente: 0,
    confirmado: 0,
    finalizado: 0
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 1,
    tipo_contraparte_id: 4,
    contraparte_id: 4,
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
    cuenta: mockTipoCuentaList[0],
    tipo_movimiento: mockTipoMovimientoList[2],
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
    cuenta_codigo_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle: 'Monto: 900,00PYG',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha_creacion: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 900,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    punto_venta_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 900,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Descuento',
    tipo_operacion_descripcion: 'Cobro',
    // Datos de la OC
    es_flete: false,
    es_gestor: false,
    es_merma: false,
    es_propietario: false,
    can_edit_oc: false,
    cantidad_destino: 0,
    condicion_gestor_carga_moneda_id: null,
    condicion_gestor_carga_tarifa: null,
    condicion_propietario_moneda_id: null,
    condicion_propietario_tarifa: null,
    merma_gestor_carga_valor: null,
    merma_gestor_carga_moneda_id: null,
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia: null,
    merma_propietario_valor: null,
    merma_propietario_moneda_id: null,
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia: null,
    // En caso de ser movimiento de anticipo
    anticipo: mockOrdenCargaAnticipoRetiradoList[0],
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.663215',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.663215',
    pendiente: 0,
    confirmado: 0,
    finalizado: 0
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 1,
    tipo_contraparte_id: 1,
    contraparte_id: 1,
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
    cuenta: mockTipoCuentaList[1],
    tipo_movimiento: mockTipoMovimientoList[3],
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
    cuenta_codigo_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle: 'Monto: 10.000,00PYG',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: null,
    liquidacion_fecha_creacion: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 10000,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'LA PAZ',
    proveedor_nombre: null,
    punto_venta_nombre: null,
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 10000,
    semi_placa: '13300300',
    tipo_contraparte_descripcion: 'Propietario',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: null,
    tipo_movimiento_descripcion: 'Complemento',
    tipo_operacion_descripcion: 'Cobro',
    // Datos de la OC
    es_flete: false,
    es_gestor: false,
    es_merma: false,
    es_propietario: false,
    can_edit_oc: false,
    cantidad_destino: 0,
    condicion_gestor_carga_moneda_id: null,
    condicion_gestor_carga_tarifa: null,
    condicion_propietario_moneda_id: null,
    condicion_propietario_tarifa: null,
    merma_gestor_carga_valor: null,
    merma_gestor_carga_moneda_id: null,
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia: null,
    merma_propietario_valor: null,
    merma_propietario_moneda_id: null,
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia: null,
    // En caso de ser movimiento de anticipo
    anticipo: mockOrdenCargaAnticipoRetiradoList[0],
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:32:14.608139',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:32:14.608139',
    pendiente: 0,
    confirmado: 0,
    finalizado: 0
  },
  {
    gestor_carga_id: 1,
    liquidacion_id: null,
    orden_carga_id: 2,
    tipo_contraparte_id: 4,
    contraparte_id: 4,
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
    cuenta: mockTipoCuentaList[0],
    tipo_movimiento: mockTipoMovimientoList[0],
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
    cuenta_codigo_descripcion: 'Viajes',
    debito: 0,
    destino_nombre: 'LA PAZ',
    detalle:
      'PDV: COMBUSTIBLE || Monto: 236.300,00PYG || Fecha: 2022-03-16 / 12:34:16',
    es_cobro: true,
    fecha_pago_cobro: null,
    flete_id: 1,
    insumo_descripcion: 'DIESEL PODIUM',
    liquidacion_fecha_creacion: null,
    moneda_nombre: 'Guaranies',
    moneda_simbolo: 'PYG',
    monto_ml: 236300,
    origen_nombre: 'GICAL KM12',
    producto_descripcion: 'Trigo',
    propietario_nombre: 'AGROFERTIL SANTA FE',
    proveedor_nombre: 'LDC_POZUELO',
    punto_venta_nombre: 'LDC_POZUELO',
    remitente_nombre: 'ADM SANTA RITA',
    remitente_numero_documento: '3100100',
    saldo: 236300,
    semi_placa: '1800100100',
    tipo_contraparte_descripcion: 'Proveedor',
    tipo_documento_relacionado_descripcion: 'OC',
    tipo_insumo_descripcion: 'COMBUSTIBLE',
    tipo_movimiento_descripcion: 'Anticipo',
    tipo_operacion_descripcion: 'Cobro',
    // Datos de la OC
    es_flete: false,
    es_gestor: false,
    es_merma: false,
    es_propietario: false,
    can_edit_oc: false,
    cantidad_destino: 0,
    condicion_gestor_carga_moneda_id: null,
    condicion_gestor_carga_tarifa: null,
    condicion_propietario_moneda_id: null,
    condicion_propietario_tarifa: null,
    merma_gestor_carga_valor: null,
    merma_gestor_carga_moneda_id: null,
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia: null,
    merma_propietario_valor: null,
    merma_propietario_moneda_id: null,
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia: null,
    // En caso de ser movimiento de anticipo
    anticipo: mockOrdenCargaAnticipoRetiradoList[0],
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
    pendiente: 0,
    confirmado: 0,
    finalizado: 0
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

export const mockMovimientoFleteEditForm: MovimientoFleteEditForm = {
  moneda_id: 1,
  tarifa: 100,
};

export const mockMovimientoMermaEditForm: MovimientoMermaEditForm = {
  moneda_id: 1,
  es_porcentual: false,
  tolerancia: 10,
  valor: 900,
};
