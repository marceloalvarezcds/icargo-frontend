import { EstadoEnum } from 'src/app/enums/estado-enum';
import { Moneda } from './moneda';
import { TipoContraparte } from './tipo-contraparte';
import { TipoCuenta } from './tipo-cuenta';
import { TipoDocumentoRelacionado } from './tipo-documento-relacionado';
import { TipoMovimiento } from './tipo-movimiento';

export interface MovimientoForm {
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
  // En caso de ser movimiento de anticipo
  anticipo_id: number | null;
  // En caso de ser movimiento de complemento o descuento
  complemento_id: number | null;
  descuento_id: number | null;
}

export interface Movimiento extends MovimientoForm {
  id: number;
  gestor_carga_id: number;
  estado: EstadoEnum;
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
  detalle: string;
  es_cobro: boolean;
  fecha_pago_cobro: string;
  flete_id: number;
  insumo_descripcion: string;
  liquidacion_fecha: string;
  moneda_nombre: string;
  moneda_simbolo: string;
  monto_ml: number;
  numero_orden_carga: string;
  origen_nombre: string;
  producto_descripcion: string;
  propietario_nombre: string;
  proveedor_nombre: string;
  remitente_nombre: string;
  remitente_numero_documento: string;
  saldo: number;
  semi_placa: string;
  tipo_contraparte_descripcion: string;
  tipo_documento_relacionado_descripcion: string;
  tipo_insumo_descripcion: string;
  tipo_movimiento_descripcion: string;
  tipo_operacion_descripcion: string;
  // Auditoría
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockMovimientoList: Movimiento[] = [];
