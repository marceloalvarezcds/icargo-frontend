import { ContraparteInfoMovimiento } from './contraparte-info';

export interface EstadoCuenta extends ContraparteInfoMovimiento {
  pendiente: number;
  en_proceso: number;
  confirmado: number;
  finalizado: number;
  cantidad_pendiente: number;
  cantidad_en_proceso: number;
  cantidad_confirmado: number;
  cantidad_finalizado: number;
  q: string;
}

export const mockEstadoCuentaList: EstadoCuenta[] = [
  {
    contraparte_id: 1,
    contraparte: 'ADM SANTA RITA',
    contraparte_numero_documento: '3100100',
    tipo_contraparte_id: 3,
    tipo_contraparte_descripcion: 'Remitente',
    pendiente: -2350000,
    en_proceso: 0,
    confirmado: 0,
    finalizado: 0,
    cantidad_pendiente: 1,
    cantidad_en_proceso: 0,
    cantidad_confirmado: 0,
    cantidad_finalizado: 0,
    q: 'contraparte=ADM+SANTA+RITA&contraparte_numero_documento=3100100&tipo_contraparte_id=3',
  },
  {
    contraparte_id: 2,
    contraparte: 'GICAL KM12',
    contraparte_numero_documento: 'p-100100',
    tipo_contraparte_id: 4,
    tipo_contraparte_descripcion: 'Proveedor',
    pendiente: 387900,
    en_proceso: 0,
    confirmado: 0,
    finalizado: 0,
    cantidad_pendiente: 1,
    cantidad_en_proceso: 0,
    cantidad_confirmado: 0,
    cantidad_finalizado: 0,
    q: 'contraparte=GICAL+KM12&contraparte_numero_documento=p-100100&tipo_contraparte_id=4',
  },
  {
    contraparte_id: 3,
    contraparte: 'LA PAZ',
    contraparte_numero_documento: '800100100',
    tipo_contraparte_id: 4,
    tipo_contraparte_descripcion: 'Proveedor',
    pendiente: 1000,
    en_proceso: 0,
    confirmado: 0,
    finalizado: 0,
    cantidad_pendiente: 1,
    cantidad_en_proceso: 0,
    cantidad_confirmado: 0,
    cantidad_finalizado: 0,
    q: 'contraparte=LA+PAZ&contraparte_numero_documento=800100100&tipo_contraparte_id=4',
  },
  {
    contraparte_id: 4,
    contraparte: 'PUERTO UNION',
    contraparte_numero_documento: 'p-400400',
    tipo_contraparte_id: 1,
    tipo_contraparte_descripcion: 'Propietario',
    pendiente: 1462400,
    en_proceso: 0,
    confirmado: 0,
    finalizado: 0,
    cantidad_pendiente: 1,
    cantidad_en_proceso: 0,
    cantidad_confirmado: 0,
    cantidad_finalizado: 0,
    q: 'contraparte=PUERTO+UNION&contraparte_numero_documento=p-400400&tipo_contraparte_id=1',
  },
];
