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
import { mockSemiList } from './semi';

export interface OrdenCargaForm {
  camion_id: number;
  semi_id: number;
  flete_id: number;
  cantidad_nominada: number;
  comentarios?: string | null;
}

export interface OrdenCarga extends OrdenCargaForm {
  id: number;
  // Datos de camion
  camion_chofer_nombre: string | null;
  camion_chofer_numero_documento: string | null;
  camion_chofer_puede_recibir_anticipos: boolean;
  camion_limite_cantidad_oc_activas: number;
  camion_limite_monto_anticipos: number | null;
  camion_placa: string;
  camion_propietario_nombre: string;
  camion_propietario_puede_recibir_anticipos: boolean;
  // Datos de semi
  semi_placa: string;
  // Datos de fletes
  flete_anticipo_maximo: number;
  flete_destino_id: number;
  flete_destino_nombre: string;
  flete_gestor_carga_id: number;
  flete_gestor_carga_nombre: string;
  flete_limite_credito: number;
  flete_numero_lote?: string | null;
  flete_monto_efectivo: number;
  flete_origen_id: number;
  flete_origen_nombre: string;
  flete_producto_descripcion: string;
  flete_proyectado: number;
  flete_remitente_nombre: string;
  flete_remitente_numero_documento: string;
  flete_tarifa: number;
  flete_tipo: TipoFleteEnum;
  gestor_carga_id: number;
  // Historial de Estados
  is_aceptado: boolean;
  is_cancelado: boolean;
  is_conciliado: boolean;
  is_contabilizado: boolean;
  is_en_proceso: boolean;
  is_finalizado: boolean;
  is_liquidado: boolean;
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
  saldos: OrdenCargaAnticipoSaldo[];
  anticipos: OrdenCargaAnticipoRetirado[];
  flete_anticipos: FleteAnticipo[];
  complementos: OrdenCargaComplemento[];
  descuentos: OrdenCargaDescuento[];
  remisiones_destino: OrdenCargaRemisionDestino[];
  remisiones_origen: OrdenCargaRemisionOrigen[];
  remisiones_resultado: OrdenCargaRemisionResultado[];
  remisiones_resultado_flete: OrdenCargaRemisionResultado[];
  cantidad_destino: number;
  cantidad_origen: number;
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
  // Datos de semi
  semi_placa: string;
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
  gestor_carga_nombre: string;
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
  remisiones: string;
  nro_tickets: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
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
  camion_chofer_nombre: camion0.chofer_nombre,
  camion_chofer_numero_documento: camion0.chofer_numero_documento,
  camion_chofer_puede_recibir_anticipos: false,
  camion_limite_cantidad_oc_activas: 1,
  camion_limite_monto_anticipos: null,
  camion_placa: camion0.placa,
  camion_propietario_nombre: camion0.propietario_nombre,
  camion_propietario_puede_recibir_anticipos: true,
  // Datos de semi
  semi_id: semi0.id,
  semi_placa: semi0.placa,
  // Datos de fletes
  flete_id: flete0.id,
  flete_anticipo_maximo: flete0_anticipo_maximo,
  flete_destino_id: flete0.destino_id,
  flete_destino_nombre: flete0.destino_nombre,
  flete_gestor_carga_id: flete0.gestor_carga_id,
  flete_gestor_carga_nombre: flete0.gestor_carga_nombre,
  flete_limite_credito: flete0_limite_credito,
  flete_numero_lote: flete0.numero_lote,
  flete_monto_efectivo: flete0_monto_efectivo,
  flete_origen_id: flete0.origen_id,
  flete_origen_nombre: flete0.origen_nombre,
  flete_producto_descripcion: flete0.producto_descripcion,
  flete_proyectado: flete0_proyectado,
  flete_remitente_nombre: flete0.remitente_nombre,
  flete_remitente_numero_documento: flete0.remitente_numero_documento,
  flete_tarifa: flete0_tarifa,
  flete_tipo: flete0.tipo_flete,
  gestor_carga_id: flete0.gestor_carga_id,
  // cantidad y comentario
  cantidad_nominada: 10000,
  comentarios: '',
  // Historial de Estados
  is_aceptado: false,
  is_cancelado: false,
  is_conciliado: false,
  is_contabilizado: false,
  is_en_proceso: false,
  is_finalizado: false,
  is_liquidado: false,
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
  historial: mockOrdenCargaEstadoHistorialList,
  saldos: mockOrdenCargaAnticipoSaldoList,
  anticipos: mockOrdenCargaAnticipoRetiradoList,
  flete_anticipos: mockFleteAnticipoList,
  complementos: mockOrdenCargaComplementoList,
  descuentos: mockOrdenCargaDescuentoList,
  remisiones_destino: mockOrdenCargaRemisionDestinoList,
  remisiones_origen: mockOrdenCargaRemisionOrigenList,
  remisiones_resultado: mockOrdenCargaRemisionResultadoList,
  remisiones_resultado_flete: mockOrdenCargaRemisionResultadoList,
  cantidad_destino: 10000,
  cantidad_origen: 10000,
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
    camion_chofer_nombre: camion0.chofer_nombre,
    camion_chofer_numero_documento: camion0.chofer_numero_documento,
    camion_placa: camion0.placa,
    camion_propietario_nombre: camion0.propietario_nombre,
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
    flete_producto_descripcion: flete0.producto_descripcion,
    flete_remitente_nombre: flete0.remitente_nombre,
    flete_remitente_numero_documento: flete0.remitente_numero_documento,
    flete_tipo: flete0.tipo_flete,
    gestor_carga_nombre: flete0.gestor_carga_nombre,
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
    camion_chofer_nombre: camion1.chofer_nombre,
    camion_chofer_numero_documento: camion1.chofer_numero_documento,
    camion_placa: camion1.placa,
    camion_propietario_nombre: camion1.propietario_nombre,
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
    camion_chofer_nombre: camion0.chofer_nombre,
    camion_chofer_numero_documento: camion0.chofer_numero_documento,
    camion_placa: camion0.placa,
    camion_propietario_nombre: camion0.propietario_nombre,
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
