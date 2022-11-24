import { EstadoEnum } from 'src/app/enums/estado-enum';
import { TipoFleteEnum } from 'src/app/enums/tipo-flete-enum';

export interface Rentabilidad {
  estado: EstadoEnum;
  oc_id: number;
  flete_id: number;
  nro_remisiones: string;
  estado_anticipo: string;
  chofer_nombre: string;
  chofer_tipo_documento: string;
  chofer_numero_documento: string;
  camion_placa: string;
  semi_placa: string;
  propietario_nombre: string;
  flete_tipo: TipoFleteEnum;
  producto_descripcion: string;
  cantidad_nominada: number;
  cantidad_destino: number;
  cantidad_origen: number;
  diferencia_origen_destino: number;
  remitente_nombre: string;
  gestor_carga_pais_id: number;
  origen_nombre: string;
  origen_pais_id: number;
  destino_nombre: string;
  destino_pais_id: number;
  lugar_carga_nombre: string;
  lugar_descarga_nombre: string;
  // PAGO FLETE a PROPIETARIO p/GC
  condicion_propietario_tarifa: number;
  condicion_propietario_moneda_nombre: string;
  condicion_propietario_moneda_simbolo: string;
  condicion_propietario_unidad_descripcion: string;
  condicion_propietario_unidad_abreviatura: string;
  propietario_flete_total: number; // cantidad_destino * tarifa
  propietario_flete_total_ml: number; // cantidad_destino * tarifa (Moneda Local)
  flete_condicion_propietario_tarifa: number;
  flete_condicion_propietario_moneda_nombre: string;
  flete_condicion_propietario_moneda_simbolo: string;
  flete_propietario_total: number; // cantidad_destino * flete_tarifa
  flete_propietario_total_ml: number; // cantidad_destino * flete_tarifa (Moneda Local)
  // COBRO por MERMA a PROPIETARIO p/GC
  merma_propietario_valor: number;
  merma_propietario_moneda_nombre: string;
  merma_propietario_moneda_simbolo: string;
  merma_propietario_unidad_descripcion: string;
  merma_propietario_unidad_abreviatura: string;
  merma_propietario_es_porcentual: boolean;
  merma_propietario_tolerancia_original: number;
  merma_propietario_tolerancia: number; // Si es_porcentual entonces (cantidad_origen * tolerancia_original) sino tolerancia_original // noqa
  merma_propietario_merma: number; // Si (diferencia_origen_destino - tolerancia) > 0 entonces (diferencia_origen_destino - tolerancia) sino 0 // noqa
  merma_propietario_valor_merma: number; // valor * merma
  flete_merma_propietario_valor: number;
  flete_merma_propietario_moneda_nombre: string;
  flete_merma_propietario_moneda_simbolo: string;
  flete_merma_propietario_es_porcentual: boolean;
  flete_merma_propietario_tolerancia_original: number;
  flete_merma_propietario_tolerancia: number; // Si es_porcentual entonces (cantidad_origen * tolerancia_original) sino tolerancia_original // noqa
  flete_merma_propietario_merma: number; // Si (diferencia_origen_destino - tolerancia) > 0 entonces (diferencia_origen_destino - tolerancia) sino 0 // noqa
  flete_merma_propietario_valor_merma: number; // flete_valor * merma
  // COBRO FLETE a REMITENTE p/GC
  condicion_gestor_carga_tarifa: number;
  condicion_gestor_carga_moneda_nombre: string;
  condicion_gestor_carga_moneda_simbolo: string;
  condicion_gestor_carga_unidad_descripcion: string;
  condicion_gestor_carga_unidad_abreviatura: string;
  gestor_carga_flete_total: number; // cantidad_destino * tarifa
  gestor_carga_flete_total_ml: number; // cantidad_destino * tarifa (Moneda Local)
  flete_condicion_gestor_carga_moneda_nombre: string;
  flete_condicion_gestor_carga_moneda_simbolo: string;
  flete_condicion_gestor_carga_tarifa: number;
  flete_gestor_carga_total: number; // cantidad_destino * flete_tarifa
  flete_gestor_carga_total_ml: number; // cantidad_destino * flete_tarifa (Moneda Local) // noqa: B950
  // PAGO por MERMA a REMITENTE p/GC
  merma_gestor_carga_valor: number;
  merma_gestor_carga_moneda_nombre: string;
  merma_gestor_carga_moneda_simbolo: string;
  merma_gestor_carga_unidad_descripcion: string;
  merma_gestor_carga_unidad_abreviatura: string;
  merma_gestor_carga_es_porcentual: boolean;
  merma_gestor_carga_tolerancia_original: number;
  merma_gestor_carga_tolerancia: number; // Si es_porcentual entonces (cantidad_origen * tolerancia_original) sino tolerancia_original // noqa
  merma_gestor_carga_merma: number; // Si (diferencia_origen_destino - tolerancia) > 0 entonces (diferencia_origen_destino - tolerancia) sino 0 // noqa
  merma_gestor_carga_valor_merma: number; // valor * merma
  flete_merma_gestor_carga_valor: number;
  flete_merma_gestor_carga_moneda_nombre: string;
  flete_merma_gestor_carga_moneda_simbolo: string;
  flete_merma_gestor_carga_es_porcentual: boolean;
  flete_merma_gestor_carga_tolerancia_original: number;
  flete_merma_gestor_carga_tolerancia: number; // Si es_porcentual entonces (cantidad_origen * tolerancia_original) sino tolerancia_original // noqa
  flete_merma_gestor_carga_merma: number; // Si (diferencia_origen_destino - tolerancia) > 0 entonces (diferencia_origen_destino - tolerancia) sino 0 // noqa
  flete_merma_gestor_carga_valor_merma: number; // flete_valor * merma
  // Complementos
  total_complemento_a_pagar: number;
  total_complemento_a_cobrar: number;
  diferencia_complemento: number;
  // Descuentos
  total_descuento_a_pagar: number;
  total_descuento_a_cobrar: number;
  diferencia_descuento: number;
  // RESULTADOS
  total_anticipo_retirado: number;
  saldo_gestor_carga: number;
  saldo_propietario: number;
  // Auditoría
  fecha_conciliacion: string;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export const mockRentabilidadList: Rentabilidad[] = [
  {
    estado: EstadoEnum.CONCILIADO,
    oc_id: 1,
    flete_id: 1,
    nro_remisiones: '7979',
    estado_anticipo: 'Liberados',
    chofer_nombre: 'Chofer Transred 3',
    chofer_tipo_documento: 'RUC',
    chofer_numero_documento: '800100100',
    camion_placa: '1800100100',
    semi_placa: '1p-200200',
    propietario_nombre: 'LA PAZ',
    flete_tipo: TipoFleteEnum.DOMESTICO,
    producto_descripcion: 'Trigo',
    cantidad_nominada: 23901,
    cantidad_destino: 23500,
    cantidad_origen: 23900,
    diferencia_origen_destino: 400,
    remitente_nombre: 'ADM SANTA RITA',
    gestor_carga_pais_id: 1,
    origen_nombre: 'GICAL KM12',
    origen_pais_id: 1,
    destino_nombre: 'LA PAZ',
    destino_pais_id: 1,
    lugar_carga_nombre: 'GICAL KM12',
    lugar_descarga_nombre: 'LA PAZ',
    condicion_propietario_tarifa: 80,
    condicion_propietario_moneda_nombre: 'Guaranies',
    condicion_propietario_moneda_simbolo: 'PYG',
    condicion_propietario_unidad_descripcion: 'Kilogramos',
    condicion_propietario_unidad_abreviatura: 'kg',
    propietario_flete_total: 1880000,
    propietario_flete_total_ml: 1880000,
    flete_condicion_propietario_tarifa: 0,
    flete_condicion_propietario_moneda_nombre: 'Guaranies',
    flete_condicion_propietario_moneda_simbolo: 'PYG',
    flete_propietario_total: 0,
    flete_propietario_total_ml: 0,
    merma_propietario_valor: 1500,
    merma_propietario_moneda_nombre: 'Guaranies',
    merma_propietario_moneda_simbolo: 'PYG',
    merma_propietario_unidad_descripcion: 'Kilogramos',
    merma_propietario_unidad_abreviatura: 'kg',
    merma_propietario_es_porcentual: false,
    merma_propietario_tolerancia_original: 50,
    merma_propietario_tolerancia: 50,
    merma_propietario_merma: 350,
    merma_propietario_valor_merma: 525000,
    flete_merma_propietario_valor: 0,
    flete_merma_propietario_moneda_nombre: 'Guaranies',
    flete_merma_propietario_moneda_simbolo: 'PYG',
    flete_merma_propietario_es_porcentual: false,
    flete_merma_propietario_tolerancia_original: 50,
    flete_merma_propietario_tolerancia: 0,
    flete_merma_propietario_merma: 0,
    flete_merma_propietario_valor_merma: 0,
    condicion_gestor_carga_tarifa: 100,
    condicion_gestor_carga_moneda_nombre: 'Guaranies',
    condicion_gestor_carga_moneda_simbolo: 'PYG',
    condicion_gestor_carga_unidad_descripcion: 'Kilogramos',
    condicion_gestor_carga_unidad_abreviatura: 'kg',
    gestor_carga_flete_total: 2350000,
    gestor_carga_flete_total_ml: 2350000,
    flete_condicion_gestor_carga_moneda_nombre: 'Guaranies',
    flete_condicion_gestor_carga_moneda_simbolo: 'PYG',
    flete_condicion_gestor_carga_tarifa: 0,
    flete_gestor_carga_total: 0,
    flete_gestor_carga_total_ml: 0,
    merma_gestor_carga_valor: 1,
    merma_gestor_carga_moneda_nombre: 'Guaranies',
    merma_gestor_carga_moneda_simbolo: 'PYG',
    merma_gestor_carga_unidad_descripcion: 'Kilogramos',
    merma_gestor_carga_unidad_abreviatura: 'kg',
    merma_gestor_carga_es_porcentual: false,
    merma_gestor_carga_tolerancia_original: 100,
    merma_gestor_carga_tolerancia: 100,
    merma_gestor_carga_merma: 300,
    merma_gestor_carga_valor_merma: 300000,
    flete_merma_gestor_carga_valor: 0,
    flete_merma_gestor_carga_moneda_nombre: 'Guaranies',
    flete_merma_gestor_carga_moneda_simbolo: 'PYG',
    flete_merma_gestor_carga_es_porcentual: false,
    flete_merma_gestor_carga_tolerancia_original: 0,
    flete_merma_gestor_carga_tolerancia: 0,
    flete_merma_gestor_carga_merma: 0,
    flete_merma_gestor_carga_valor_merma: 0,
    total_complemento_a_pagar: 15000,
    total_complemento_a_cobrar: 17000,
    diferencia_complemento: 2000,
    total_descuento_a_pagar: 1900,
    total_descuento_a_cobrar: 2000,
    diferencia_descuento: 100,
    total_anticipo_retirado: 396200,
    saldo_gestor_carga: 1196800,
    saldo_propietario: -1837650,
    fecha_conciliacion: '2022-04-18T11:33:50.898494',
    created_by: 'admin-suplente-transred',
    created_at: '2022-04-13T13:26:35.390258',
    modified_by: 'admin-transred',
    modified_at: '2022-04-18T11:33:50.925605',
  },
];
