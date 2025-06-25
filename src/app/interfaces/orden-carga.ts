import { EstadoEnum } from '../enums/estado-enum';
import { OrdenCargaEstadoEnum } from '../enums/orden-carga-enum';
import { TipoFleteEnum } from '../enums/tipo-flete-enum';
import { AuditDatabase, mockAuditDatabaseList } from './audit-database';
import { mockCamionList } from './camion';
import { CentroOperativo, mockCentroOperativoList } from './centro-operativo';
import { mockFleteList } from './flete';
import { FleteAnticipo, mockFleteAnticipoList } from './flete-anticipo';
import { mockMovimientoList, Movimiento } from './movimiento';
import {
  mockOrdenCargaAnticipoPorcentajeList,
  OrdenCargaAnticipoPorcentaje,
} from './orden-carga-anticipo-porcentaje';
import {
  mockOrdenCargaAnticipoRetiradoList,
  OrdenCargaAnticipoRetirado,
} from './orden-carga-anticipo-retirado';
import {
  mockOrdenCargaAnticipoSaldoList,
  OrdenCargaAnticipoSaldo,
} from './orden-carga-anticipo-saldo';
import {
  mockOrdenCargaComplementoList,
  OrdenCargaComplemento,
  UpdateOrdenCargaComplementoForm,
} from './orden-carga-complemento';
import {
  mockOrdenCargaDescuentoList,
  OrdenCargaDescuento,
} from './orden-carga-descuento';
import {
  mockOrdenCargaEstadoHistorialList,
  OrdenCargaEstadoHistorial,
} from './orden-carga-estado-historial';
import {
  mockOrdenCargaRemisionDestinoList,
  OrdenCargaRemisionDestino,
} from './orden-carga-remision-destino';
import {
  mockOrdenCargaRemisionOrigenList,
  OrdenCargaRemisionOrigen,
} from './orden-carga-remision-origen';
import {
  mockOrdenCargaRemisionResultadoList,
  OrdenCargaRemisionResultado,
} from './orden-carga-remision-resultado';
import { mockOrdenCargaComentariosHistorialList, OrdenCargaComentariosHistorial } from './orden_carga_comentarios_historial';
import { OrdenCargaEvaluacionesHistorial, mockOrdenCargaEvaluacionesHistorialList } from './orden_carga_evaluacion';
import { mockSemiList } from './semi';

export interface OrdenCargaForm {
  camion_id: number;
  semi_id: number;
  chofer_id:number;
  propietario_id:number;
  combinacion_id: number;
  flete_id: number;
  cantidad_nominada: number;
  comentarios?: string | null;
  estado: EstadoEnum;
}

export interface OrdenCarga extends OrdenCargaForm {
  id: number;
  // Datos de camion
  camion_marca: string | null;
  camion_color: string | null;
  camion_chofer_nombre: string | null;
  camion_chofer_numero_documento: string | null;
  camion_chofer_puede_recibir_anticipos: boolean;
  camion_limite_cantidad_oc_activas: number;
  camion_limite_monto_anticipos: number | null;
  camion_monto_anticipo_disponible: number | null;
  camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso:
    | number
    | null;
  camion_placa: string;
  camion_propietario_nombre: string;
  camion_propietario_puede_recibir_anticipos: boolean;
  combinacion_chofer_puede_recibir_anticipos: boolean;
  combinacion_propietario_id: number;
  combinacion_chofer_id: number;
  chofer_nombre: string;
  propietario_nombre: string;
  chofer_documento: string;
  neto:number;
  combinacion_id: number;
  camion_beneficiario_nombre: string;
  camion_beneficiario_documento: string;
  camion_propietario_documento: string;
  camion_estado: string | null;
  combinacion_chofer_doc: string;
  documento_fisico: boolean;
  // Datos de semi
  semi_placa: string;
  semi_marca: string | null;
  semi_color: string | null;
  semi_estado: string | null;
  monto_anticipo_retirado: number | null;
  resultado_propietario_total_anticipos_retirados: number | null;
  resultado_propietario_total_anticipos_retirados_efectivo: number | null;
  resultado_propietario_total_anticipos_retirados_combustible: number | null;
  resultado_propietario_total_anticipos_retirados_lubricantes: number | null;
  resultado_gestor_carga_merma_valor_total_moneda_local: number | null;
  total_anticipo_efectivo: number | null;
  total_anticipo_combustible:  number | null;
  total_anticipo_lubricantes: number | null;
  flete_saldo_efectivo: number | null;
  flete_saldo_combustible: number | null;
  flete_saldo_lubricante: number | null;
  // Datos de fletes
  flete_producto_id: number;
  flete_anticipo_maximo: number;
  flete_destino_id: number;
  flete_destino_nombre: string;
  flete_tarifa_unidad_gestor_carga: string;
  flete_merma_unidad_gestor_carga: string;
  flete_moneda_id:number;
  flete_gestor_carga_id: number;
  flete_gestor_carga_nombre: string;
  flete_limite_credito: number;
  flete_numero_lote?: string | null;
  flete_monto_efectivo: number;
  flete_monto_efectivo_complemento: number;
  flete_monto_combustible: number;
  flete_monto_lubricante: number;
  flete_origen_id: number;
  flete_origen_nombre: string;
  flete_producto_descripcion: string;
  flete_proyectado: number;
  flete_proyectado_ml: number;
  flete_remitente_nombre: string;
  flete_remitente_numero_documento: string;
  flete_tarifa_unidad_abreviatura: string;
  flete_tarifa_unidad: string;
  flete_merma_unidad: string;
  flete_tarifa: number;

  flete_tipo: TipoFleteEnum;
  gestor_carga_id: number;
  flete_saldo: number;
  linea_disponible: number;

  //Condiciones para GC y Propietario
  gestor_carga_moneda_simbolo: string;
  condicion_gestor_cuenta_tarifa: number;
  condicion_gestor_carga_tarifa_ml: number;
  condicion_propietario_tarifa: number;
  condicion_propietario_tarifa_ml: number;
  condicion_gestor_moneda_simbolo: string
  gestor_carga_moneda_id: number;
  condicion_gestor_carga_moneda_id: number
  condicion_propietario_moneda_simbolo: string
  condicion_propietario_moneda_id: number
  //Merma para Gestor de Carga
  merma_gestor_carga_es_porcentual_descripcion: string;
  merma_gestor_carga_tolerancia: number;
  merma_gestor_carga_valor: number;
  merma_gestor_carga_valor_ml: number;
  //Merma para el Propietario
  merma_propietario_es_porcentual_descripcion: string;
  merma_propietario_tolerancia: number;
  merma_propietario_valor: number;
  merma_propietario_valor_ml: number;
  // Historial de Estados
  is_aceptado: boolean;
  is_cancelado: boolean;
  is_conciliado: boolean;
  is_contabilizado: boolean;
  is_en_proceso: boolean;
  is_finalizado: boolean;
  is_liquidado: boolean;
  is_anulado: boolean;
  // Campos para la edición
  estado: EstadoEnum;
  orden_carga_estado: OrdenCargaEstadoEnum;
  estado_valor: EstadoEnum | OrdenCargaEstadoEnum;
  anticipos_liberados: boolean;
  anticipos_liberados_descripcion: string;
  // INICIO Tramo de OC
  origen_id: number;
  origen: CentroOperativo;
  destino_id: number;
  destino: CentroOperativo;
  // FIN Tramo de OC
  // Relaciones Listas
  modify_by_movimiento: boolean;
  auditorias: AuditDatabase[];
  movimientos: Movimiento[];
  historial: OrdenCargaEstadoHistorial[];
  comentario: OrdenCargaComentariosHistorial[];
  evaluaciones_historial: OrdenCargaEvaluacionesHistorial[];
  saldos: OrdenCargaAnticipoSaldo[];
  saldos_flete_id: OrdenCargaAnticipoSaldo[];
  anticipos: OrdenCargaAnticipoRetirado[];
  porcentaje_anticipos: OrdenCargaAnticipoPorcentaje[];
  flete_anticipos: FleteAnticipo[];
  complementos: OrdenCargaComplemento[];
  complementosUpdate: UpdateOrdenCargaComplementoForm[];
  descuentos: OrdenCargaDescuento[];
  remisiones_destino: OrdenCargaRemisionDestino[];
  remisiones_origen: OrdenCargaRemisionOrigen[];
  remisiones_resultado: OrdenCargaRemisionResultado[];
  remisiones_resultado_flete: OrdenCargaRemisionResultado[];
  cantidad_destino: number;
  cantidad_origen: number;
  diferencia_origen_destino: number;
  total_anticipo: number;
  total_anticipo_complemento: number;
  total_anticipo_retirado: number;
  total_anticipo_disponible: number;
  tipo_evaluacion_id: number;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface OrdenCargaList extends OrdenCargaForm {
  id: number;
  // Datos de camion
  camion_chofer_nombre: string | null;
  camion_chofer_numero_documento: string | null;
  camion_placa: string;
  camion_propietario_nombre: string;
  chofer_nombre: string;
  propietario_nombre: string;
  chofer_documento: string;
  // Datos de semi
  semi_placa: string;
  combinacion_id: number;
  combinacion_chofer_nombre: string;
  combinacion_chofer_doc: string;
  // Datos de fletes
  flete_destino_nombre: string;
  flete_gestor_carga_id: number;
  flete_gestor_carga_nombre: string;
  flete_numero_lote?: string | null;
  flete_origen_nombre: string;
  flete_producto_descripcion: string;
  flete_remitente_nombre: string;
  flete_remitente_numero_documento: string;
  flete_tipo: TipoFleteEnum;
  flete_saldo: number;
  resultado_flete_gestor_carga_merma_valor:number;
  gestor_carga_nombre: string;
  condicion_propietario_moneda_simbolo: string
  condicion_gestor_moneda_simbolo: string
  resultado_gestor_carga_saldo_total: number;
  //Condiciones
  condicion_gestor_cuenta_tarifa: number;
  condicion_propietario_tarifa: number;

  // Campos para la edición
  estado: EstadoEnum;
  orden_carga_estado: OrdenCargaEstadoEnum;
  estado_valor: EstadoEnum | OrdenCargaEstadoEnum;
  anticipos_liberados: boolean;
  anticipos_liberados_descripcion: string;
  // INICIO Tramo de OC
  origen_id: number;
  origen_nombre: string;
  destino_id: number;
  destino_nombre: string;
  // FIN Tramo de OC
  cantidad_destino: number;
  cantidad_origen: number;
  diferencia_origen_destino: number;
  remisiones: string;
  nro_tickets: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface OrdenCargaRemitir {
  oc: OrdenCarga;
  created_at: string;
}

export interface RecalculoCondiciones {
  condicion_gestor_carga_tarifa_ml: number;
  condicion_propietario_tarifa_ml: number;
  merma_gestor_carga_valor_ml: number;
  merma_propietario_valor_ml: number;
  flete_cargado: number;
}

export interface AnticiposPorOrdenCarga {
  id: number;
  chofer_id?: number;
  propietario_id?: number;
  anticipo_chofer?: number;
  anticipo_propietario?: number;
}


const camion0 = mockCamionList[0];
const camion1 = mockCamionList[1];

const flete0 = mockFleteList[0];
const flete1 = mockFleteList[1];
const flete2 = mockFleteList[2];

const semi0 = mockSemiList[0];
const semi1 = mockSemiList[1];

const centroOperativo0 = mockCentroOperativoList[0];
const centroOperativo1 = mockCentroOperativoList[1];
const centroOperativo2 = mockCentroOperativoList[2];

const flete0_cantidad_nominada = 10000;
const flete0_tarifa = flete0.condicion_propietario_tarifa;
const flete0_anticipo_maximo = 30;
const flete0_proyectado = flete0_cantidad_nominada * flete0_tarifa;
const flete0_limite_credito =
  (flete0_anticipo_maximo / 100) * flete0_proyectado;
const flete0_monto_efectivo = 0.1 * flete0_proyectado;

export const mockOrdenCarga1: OrdenCarga = {
  id: 1,
  // Datos de camion
  camion_id: camion0.id,
  chofer_id: 1,
  propietario_id:2,
  combinacion_id: camion0.id,
  camion_marca: '',
  camion_color: '',
  camion_chofer_nombre: camion0.chofer_nombre,
  camion_chofer_numero_documento: camion0.chofer_numero_documento,
  camion_chofer_puede_recibir_anticipos: false,
  combinacion_propietario_id: 1,
  combinacion_chofer_id: 1,
  camion_limite_cantidad_oc_activas: 1,
  camion_limite_monto_anticipos: null,
  camion_monto_anticipo_disponible: null,
  camion_total_anticipos_retirados_en_estado_pendiente_o_en_proceso: null,
  camion_placa: camion0.placa,
  camion_propietario_nombre: camion0.propietario_nombre,
  combinacion_chofer_puede_recibir_anticipos: false,
  camion_propietario_puede_recibir_anticipos: true,
  camion_propietario_documento: 'string',
  camion_estado: 'activo',
  combinacion_chofer_doc: 'string',
  chofer_nombre: 'string',
  propietario_nombre: 'string',
  chofer_documento: 'string',
  documento_fisico:false,
  // Datos de semi
  semi_id: semi0.id,
  semi_placa: semi0.placa,
  semi_marca: semi0.placa,
  semi_color: semi0.placa,
  semi_estado: 'activo',
  monto_anticipo_retirado: 9000,
  resultado_propietario_total_anticipos_retirados:9000,
  resultado_propietario_total_anticipos_retirados_efectivo: 9000,
  resultado_propietario_total_anticipos_retirados_combustible:10000,
  resultado_propietario_total_anticipos_retirados_lubricantes: 135000,
  resultado_gestor_carga_merma_valor_total_moneda_local: 2000,
  total_anticipo_combustible:9000,
  total_anticipo_efectivo:9000,
  total_anticipo_lubricantes: 10000,
  // Datos de fletes
  flete_id: flete0.id,
  flete_anticipo_maximo: flete0_anticipo_maximo,
  flete_destino_id: flete0.destino_id,
  flete_destino_nombre: flete0.destino_nombre,
  flete_gestor_carga_id: flete0.gestor_carga_id,
  flete_gestor_carga_nombre: flete0.gestor_carga_nombre,
  flete_tarifa_unidad_gestor_carga:'USD/TON',
  flete_merma_unidad_gestor_carga: 'PYG/kg',
  flete_moneda_id: 1,
  gestor_carga_moneda_id: 10,
  flete_limite_credito: flete0_limite_credito,
  flete_numero_lote: flete0.numero_lote,
  flete_monto_efectivo: flete0_monto_efectivo,
  flete_monto_efectivo_complemento: flete0_monto_efectivo,
  flete_monto_combustible: 9000,
  flete_monto_lubricante: 1000,
  flete_origen_id: flete0.origen_id,
  flete_origen_nombre: flete0.origen_nombre,
  flete_producto_descripcion: flete0.producto_descripcion,
  flete_proyectado: flete0_proyectado,
  flete_proyectado_ml: flete0_proyectado,
  flete_remitente_nombre: flete0.remitente_nombre,
  flete_remitente_numero_documento: flete0.remitente_numero_documento,
  flete_tarifa: flete0_tarifa,
  flete_tipo: flete0.tipo_flete,
  flete_saldo: 0,
  flete_tarifa_unidad_abreviatura: 'kg',
  flete_tarifa_unidad: 'PYG/kg',
  flete_merma_unidad: 'PYG/KG',
  flete_producto_id: 1,
  linea_disponible: 9000,
  gestor_carga_id: flete0.gestor_carga_id,
  neto:1000,
  camion_beneficiario_nombre: 'string',
  camion_beneficiario_documento: 'string',
  // cantidad y comentario
  cantidad_nominada: 10000,
  comentarios: '',
  //Condiciones para GC y Propietario
  gestor_carga_moneda_simbolo: 'PYG',
  condicion_gestor_cuenta_tarifa: flete0.gestor_carga_id,
  condicion_gestor_carga_tarifa_ml:1,
  condicion_propietario_tarifa: 90,
  condicion_gestor_moneda_simbolo:'USD',
  condicion_propietario_moneda_simbolo:'PYG',
  condicion_gestor_carga_moneda_id:1,
  condicion_propietario_moneda_id:1,
  condicion_propietario_tarifa_ml: 100,
  //Merma para Gestor de Carga
  merma_gestor_carga_es_porcentual_descripcion: 'v',
  merma_gestor_carga_tolerancia: 30,
  merma_gestor_carga_valor: 5000,
  merma_gestor_carga_valor_ml: 5000,
  //Merma para el Propietario
  merma_propietario_es_porcentual_descripcion: 'v',
  merma_propietario_tolerancia: 20,
  merma_propietario_valor: 5500,
  merma_propietario_valor_ml: 5500,
  flete_saldo_efectivo: 1000,
  flete_saldo_combustible: 800,
  flete_saldo_lubricante: 800,
  // Historial de Estados
  is_aceptado: false,
  is_cancelado: false,
  is_conciliado: false,
  is_contabilizado: false,
  is_en_proceso: false,
  is_finalizado: false,
  is_liquidado: false,
  is_anulado: false,
  // Campos para la edición
  estado: EstadoEnum.NUEVO,
  orden_carga_estado: OrdenCargaEstadoEnum.PENDIENTE,
  estado_valor: EstadoEnum.NUEVO,
  anticipos_liberados: false,
  anticipos_liberados_descripcion: 'No',
  // INICIO Tramo de OC
  origen_id: centroOperativo0.id,
  origen: centroOperativo0,
  destino_id: centroOperativo1.id,
  destino: centroOperativo0,
  // FIN Tramo de OC
  // Relaciones Listas
  modify_by_movimiento: false,
  auditorias: mockAuditDatabaseList,
  movimientos: mockMovimientoList,
  comentario: mockOrdenCargaComentariosHistorialList,
  evaluaciones_historial: mockOrdenCargaEvaluacionesHistorialList,
  historial: mockOrdenCargaEstadoHistorialList,
  saldos: mockOrdenCargaAnticipoSaldoList,
  saldos_flete_id: mockOrdenCargaAnticipoSaldoList,
  anticipos: mockOrdenCargaAnticipoRetiradoList,
  porcentaje_anticipos: mockOrdenCargaAnticipoPorcentajeList,
  flete_anticipos: mockFleteAnticipoList,
  complementos: mockOrdenCargaComplementoList,
  complementosUpdate: mockOrdenCargaComplementoList,
  descuentos: mockOrdenCargaDescuentoList,
  remisiones_destino: mockOrdenCargaRemisionDestinoList,
  remisiones_origen: mockOrdenCargaRemisionOrigenList,
  remisiones_resultado: mockOrdenCargaRemisionResultadoList,
  remisiones_resultado_flete: mockOrdenCargaRemisionResultadoList,
  cantidad_destino: 10000,
  cantidad_origen: 10000,
  diferencia_origen_destino: 0,
  total_anticipo: 10000,
  total_anticipo_complemento: 10000,
  total_anticipo_retirado: 10000,
  total_anticipo_disponible: 10000,
  tipo_evaluacion_id: 2,
  // Auditoría
  created_by: 'system',
  created_at: '2021-11-30T20:38:09.553757',
  modified_by: 'system',
  modified_at: '2021-11-30T20:38:09.553757',
};

export const mockOrdenCargaList: OrdenCargaList[] = [
  {
    id: 1,
    // Datos de camion
    camion_id: camion0.id,
    chofer_id: 1,
    propietario_id:2,
    combinacion_id: camion0.id,
    camion_chofer_nombre: camion0.chofer_nombre,
    camion_chofer_numero_documento: camion0.chofer_numero_documento,
    camion_placa: camion0.placa,
    camion_propietario_nombre: camion0.propietario_nombre,
    chofer_nombre: 'juan',
    propietario_nombre: 'david',
    chofer_documento: '504367',
    condicion_propietario_moneda_simbolo: 'brl',
    condicion_gestor_moneda_simbolo: 'pgy',
    // Datos de semi
    semi_id: semi0.id,
    semi_placa: semi0.placa,
    // Datos de fletes
    flete_id: flete0.id,
    flete_destino_nombre: flete0.destino_nombre,
    flete_gestor_carga_id: flete0.gestor_carga_id,
    flete_gestor_carga_nombre: flete0.gestor_carga_nombre,
    flete_numero_lote: flete0.numero_lote,
    flete_origen_nombre: flete0.origen_nombre,
    flete_saldo: 2000,
    resultado_flete_gestor_carga_merma_valor: 20,
    condicion_gestor_cuenta_tarifa: 100,
    flete_producto_descripcion: flete0.producto_descripcion,
    flete_remitente_nombre: flete0.remitente_nombre,
    flete_remitente_numero_documento: flete0.remitente_numero_documento,
    flete_tipo: flete0.tipo_flete,
    gestor_carga_nombre: flete0.gestor_carga_nombre,
    condicion_propietario_tarifa: 90,
    resultado_gestor_carga_saldo_total:100,
    combinacion_chofer_nombre: 'dario',
    combinacion_chofer_doc: '900',
    // cantidad y comentario
    cantidad_nominada: 10000,
    comentarios: '',
    // Campos para la edición
    estado: EstadoEnum.NUEVO,
    orden_carga_estado: OrdenCargaEstadoEnum.PENDIENTE,
    estado_valor: EstadoEnum.NUEVO,
    anticipos_liberados: false,
    anticipos_liberados_descripcion: 'No',
    // INICIO Tramo de OC
    origen_id: centroOperativo0.id,
    origen_nombre: centroOperativo0.nombre,
    destino_id: centroOperativo1.id,
    destino_nombre: centroOperativo0.nombre,
    // FIN Tramo de OC
    cantidad_destino: 10000,
    cantidad_origen: 10000,
    diferencia_origen_destino: 0,
    remisiones: mockOrdenCargaRemisionOrigenList
      .map((x) => x.numero_documento)
      .join(', '),
    nro_tickets: mockOrdenCargaRemisionDestinoList
      .map((x) => x.numero_documento)
      .join(', '),
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 2,
    // Datos de camion
    camion_id: camion1.id,
    chofer_id: 1,
    propietario_id:2,
    combinacion_id: camion0.id,
    camion_chofer_nombre: camion1.chofer_nombre,
    camion_chofer_numero_documento: camion1.chofer_numero_documento,
    camion_placa: camion1.placa,
    camion_propietario_nombre: camion1.propietario_nombre,
    chofer_nombre: 'juan',
    propietario_nombre: 'david',
    chofer_documento: '504367',
    condicion_propietario_moneda_simbolo: 'pyg',
    condicion_gestor_moneda_simbolo: 'pgy',
    // Datos de semi
    semi_id: semi1.id,
    semi_placa: semi1.placa,
    // Datos de fletes
    flete_id: flete1.id,
    flete_destino_nombre: flete1.destino_nombre,
    flete_gestor_carga_id: flete1.gestor_carga_id,
    flete_gestor_carga_nombre: flete1.gestor_carga_nombre,
    flete_numero_lote: flete1.numero_lote,
    flete_origen_nombre: flete1.origen_nombre,
    flete_producto_descripcion: flete1.producto_descripcion,
    flete_remitente_nombre: flete1.remitente_nombre,
    flete_remitente_numero_documento: flete1.remitente_numero_documento,
    flete_tipo: flete1.tipo_flete,
    gestor_carga_nombre: flete0.gestor_carga_nombre,
    combinacion_chofer_nombre: 'dario',
    condicion_propietario_tarifa: 90,
    resultado_gestor_carga_saldo_total:100,
    flete_saldo: 2000,
    resultado_flete_gestor_carga_merma_valor: 20,
    condicion_gestor_cuenta_tarifa: 100,
    combinacion_chofer_doc: '900',
    // cantidad y comentario
    cantidad_nominada: 10000,
    comentarios: '',
    // Campos para la edición
    estado: EstadoEnum.ACEPTADO,
    orden_carga_estado: OrdenCargaEstadoEnum.PENDIENTE,
    estado_valor: EstadoEnum.NUEVO,
    anticipos_liberados: true,
    anticipos_liberados_descripcion: 'Si',
    // INICIO Tramo de OC
    origen_id: centroOperativo1.id,
    origen_nombre: centroOperativo1.nombre,
    destino_id: centroOperativo2.id,
    destino_nombre: centroOperativo2.nombre,
    // FIN Tramo de OC
    cantidad_destino: 10000,
    cantidad_origen: 10000,
    diferencia_origen_destino:0,
    remisiones: mockOrdenCargaRemisionOrigenList
      .map((x) => x.numero_documento)
      .join(', '),
    nro_tickets: mockOrdenCargaRemisionDestinoList
      .map((x) => x.numero_documento)
      .join(', '),
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
  {
    id: 3,
    // Datos de camion
    camion_id: camion0.id,
    chofer_id: 1,
    propietario_id:2,
    combinacion_id: camion0.id,
    camion_chofer_nombre: camion0.chofer_nombre,
    camion_chofer_numero_documento: camion0.chofer_numero_documento,
    camion_placa: camion0.placa,
    camion_propietario_nombre: camion0.propietario_nombre,
    combinacion_chofer_nombre: 'dario',
    chofer_nombre: 'juan',
    propietario_nombre: 'david',
    chofer_documento: '504367',
    condicion_propietario_moneda_simbolo: 'brl',
    condicion_gestor_moneda_simbolo: 'usd',
    // Datos de semi
    semi_id: semi0.id,
    semi_placa: semi0.placa,
    // Datos de fletes
    flete_id: flete2.id,
    flete_destino_nombre: flete2.destino_nombre,
    flete_gestor_carga_id: flete2.gestor_carga_id,
    flete_gestor_carga_nombre: flete2.gestor_carga_nombre,
    flete_numero_lote: flete2.numero_lote,
    flete_origen_nombre: flete2.origen_nombre,
    flete_producto_descripcion: flete2.producto_descripcion,
    flete_remitente_nombre: flete2.remitente_nombre,
    flete_remitente_numero_documento: flete2.remitente_numero_documento,
    flete_tipo: flete2.tipo_flete,
    gestor_carga_nombre: flete0.gestor_carga_nombre,
    condicion_propietario_tarifa: 100,
    resultado_gestor_carga_saldo_total:100,
    flete_saldo: 2000,
    resultado_flete_gestor_carga_merma_valor: 20,
    condicion_gestor_cuenta_tarifa: 100,
    combinacion_chofer_doc: '900',
    // cantidad y comentario
    cantidad_nominada: 10000,
    comentarios: '',
    // Campos para la edición
    estado: EstadoEnum.FINALIZADO,
    orden_carga_estado: OrdenCargaEstadoEnum.PENDIENTE,
    estado_valor: EstadoEnum.NUEVO,
    anticipos_liberados: false,
    anticipos_liberados_descripcion: 'No',
    // INICIO Tramo de OC
    origen_id: centroOperativo2.id,
    origen_nombre: centroOperativo2.nombre,
    destino_id: centroOperativo0.id,
    destino_nombre: centroOperativo0.nombre,
    // FIN Tramo de OC
    cantidad_destino: 10000,
    cantidad_origen: 10000,
    diferencia_origen_destino: 0,
    remisiones: mockOrdenCargaRemisionOrigenList
      .map((x) => x.numero_documento)
      .join(', '),
    nro_tickets: mockOrdenCargaRemisionDestinoList
      .map((x) => x.numero_documento)
      .join(', '),
    // Auditoría
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
  },
];
