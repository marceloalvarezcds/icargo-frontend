import { EstadoEnum } from 'src/app/enums/estado-enum';
import { OperacionEstadoEnum } from 'src/app/enums/operacion-estado-enum';
import { mockBanco1, mockBanco2 } from './banco';
import { mockCaja1, mockCaja2 } from './caja';
import { mockInstrumentoVia1, mockInstrumentoVia2 } from './instrumento-via';
import { mockLiquidacion1, mockLiquidacion2 } from './liquidacion';
import { mockTipoInstrumento1, mockTipoInstrumento2 } from './tipo-instrumento';
import { mockMonedaList, Moneda } from './moneda';

interface InstrumentoBaseModel {
  via_id: number;
  caja_id: number;
  banco_id: number;
  liquidacion_id: number;
  fecha_instrumento: string;
  fecha_cobro: string;
  numero_referencia: string;
  comentario: string | null;
  // Datos mostrados solo para Banco
  tipo_instrumento_id: number;
  // Solo para cheque
  cheque_es_diferido: boolean;
  cheque_fecha_vencimiento: string | null;
}

export interface InstrumentoForm extends InstrumentoBaseModel {
  monto: number;
  monto_ml: number;
}

export interface InstrumentoLiquidacionItem extends InstrumentoForm {
  via_descripcion: string;
  cuenta_descripcion: string;
  tipo_instrumento_descripcion: string;
  numero_documento: string | null;
  moneda_id: number;
  moneda_abr: string | null;
  saldo_cc: number;
  tipo_cambio_moneda: number;
}

export interface Instrumento extends InstrumentoForm {
  id: number;
  estado: EstadoEnum;
  credito: number;
  debito: number;
  saldo_confirmado: number;
  // Datos mostrados solo para Banco
  operacion_estado: OperacionEstadoEnum;
  provision: number;
  saldo_provisional: number;
  provision_rechazada: number;
  // Datos calculados
  contraparte: string;
  contraparte_numero_documento: string;
  cuenta_descripcion: string;
  moneda_id: number;
  moneda_nombre: string;
  moneda_simbolo: string;
  moneda: Moneda;
  tipo_cambio_moneda: number;
  saldo_total: number;
  tipo_contraparte_descripcion: string;
  tipo_instrumento_descripcion: string;
  tipo_operacion_descripcion: string;
  url: string;
  via_descripcion: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockInstrumentoForm: InstrumentoForm = {
  via_id: mockInstrumentoVia1.id,
  caja_id: mockCaja1.id,
  banco_id: mockBanco1.id,
  liquidacion_id: mockLiquidacion1.id,
  monto: 0,
  fecha_instrumento: '2022-03-16T12:32:14.859823',
  fecha_cobro: '2022-03-16T12:32:14.859823',
  numero_referencia: '111111-1',
  comentario: '',
  // Datos mostrados solo para Banco
  tipo_instrumento_id: mockTipoInstrumento1.id,
  // Solo para cheque
  cheque_es_diferido: false,
  cheque_fecha_vencimiento: null,
  monto_ml:0,
};

export const mockInstrumentoLiquidacionItem: InstrumentoLiquidacionItem = {
  via_id: mockInstrumentoVia1.id,
  via_descripcion: mockInstrumentoVia1.descripcion,
  caja_id: mockCaja1.id,
  banco_id: mockBanco1.id,
  cuenta_descripcion: mockCaja1.nombre,
  liquidacion_id: mockLiquidacion1.id,
  monto: 0,
  fecha_instrumento: '2022-03-16T12:32:14.859823',
  fecha_cobro: '2022-03-16T12:32:14.859823',
  numero_referencia: '111111-1',
  comentario: '',
  moneda_abr: '',
  // Datos mostrados solo para Banco
  tipo_instrumento_id: mockTipoInstrumento1.id,
  tipo_instrumento_descripcion: mockTipoInstrumento1.descripcion,
  // Solo para cheque
  cheque_es_diferido: false,
  cheque_fecha_vencimiento: null,
  moneda_id:1,
  numero_documento:null,
  saldo_cc:0,
  tipo_cambio_moneda:0,
  monto_ml:0,
};

export const mockInstrumentoList: Instrumento[] = [
  {
    id: 1,
    estado: EstadoEnum.ACTIVO,
    via_id: mockInstrumentoVia1.id,
    caja_id: mockCaja1.id,
    banco_id: mockBanco1.id,
    liquidacion_id: mockLiquidacion1.id,
    fecha_cobro: '2022-03-16T12:32:14.859823',
    monto: 0,
    monto_ml:0,
    credito: 0,
    debito: 0,
    saldo_confirmado: 0,
    fecha_instrumento: '2022-03-16T12:32:14.859823',
    numero_referencia: '111111-1',
    comentario: '',
    // Datos mostrados solo para Banco
    tipo_instrumento_id: mockTipoInstrumento1.id,
    operacion_estado: OperacionEstadoEnum.EMITIDO,
    provision: 0,
    saldo_provisional: 0,
    provision_rechazada: 0,
    // Solo para cheque
    cheque_es_diferido: false,
    cheque_fecha_vencimiento: null,
    // Datos calculados
    contraparte: mockLiquidacion1.contraparte,
    contraparte_numero_documento: mockLiquidacion1.contraparte_numero_documento,
    cuenta_descripcion: mockCaja1.nombre,
    moneda_id: mockCaja1.moneda_id,
    moneda_nombre: mockCaja1.moneda_nombre,
    moneda_simbolo: mockCaja1.moneda_simbolo,
    saldo_total: 1,
    tipo_contraparte_descripcion: mockLiquidacion1.tipo_contraparte_descripcion,
    tipo_instrumento_descripcion: mockTipoInstrumento1.descripcion,
    tipo_operacion_descripcion: mockLiquidacion1.tipo_operacion_descripcion,
    url: '',
    moneda: mockMonedaList[0],
    tipo_cambio_moneda:0,
    via_descripcion: mockInstrumentoVia1.descripcion,
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
  },
  {
    id: 2,
    estado: EstadoEnum.ACTIVO,
    via_id: mockInstrumentoVia2.id,
    caja_id: mockCaja2.id,
    banco_id: mockBanco2.id,
    fecha_cobro: '2022-03-16T12:32:14.859823',
    liquidacion_id: mockLiquidacion2.id,
    monto: 0,
    credito: 0,
    debito: 0,
    monto_ml:0,
    saldo_confirmado: 0,
    fecha_instrumento: '2022-03-16T12:32:14.859823',
    numero_referencia: '111111-1',
    comentario: '',
    // Datos mostrados solo para Banco
    tipo_instrumento_id: mockTipoInstrumento2.id,
    operacion_estado: OperacionEstadoEnum.EMITIDO,
    provision: 0,
    saldo_provisional: 0,
    provision_rechazada: 0,
    // Solo para cheque
    cheque_es_diferido: false,
    cheque_fecha_vencimiento: null,
    moneda: mockMonedaList[0],
    tipo_cambio_moneda:0,
    // Datos calculados
    contraparte: mockLiquidacion2.contraparte,
    contraparte_numero_documento: mockLiquidacion2.contraparte_numero_documento,
    cuenta_descripcion: mockCaja2.nombre,
    moneda_id: mockCaja2.moneda_id,
    moneda_nombre: mockCaja2.moneda_nombre,
    moneda_simbolo: mockCaja2.moneda_simbolo,
    saldo_total: 2,
    tipo_contraparte_descripcion: mockLiquidacion2.tipo_contraparte_descripcion,
    tipo_instrumento_descripcion: mockTipoInstrumento2.descripcion,
    tipo_operacion_descripcion: mockLiquidacion2.tipo_operacion_descripcion,
    url: '',
    via_descripcion: mockInstrumentoVia2.descripcion,
    // Auditoría
    created_by: 'admin-transred',
    created_at: '2022-03-16T12:34:16.869250',
    modified_by: 'admin-transred',
    modified_at: '2022-03-16T12:34:16.869250',
  },
];
