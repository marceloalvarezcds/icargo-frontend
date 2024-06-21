import { EstadoEnum } from '../enums/estado-enum';
import {
  Ciudad,
  mockCiudadArgentina,
  mockCiudadBrasil,
  mockCiudadParaguay,
} from './ciudad';
import {
  ComposicionJuridica,
  mockComposicionJuridicaList,
} from './composicion-juridica';
import { mockMonedaList, Moneda } from './moneda';
import { mockTipoDocumentoList, TipoDocumento } from './tipo-documento';

export interface GestorCarga {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  tipo_documento_id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  digito_verificador: string;
  composicion_juridica_id: number | null;
  composicion_juridica: ComposicionJuridica | null;
  moneda_id: number;
  moneda: Moneda;
  logo?: string | null;
  telefono: string;
  email?: string | null;
  pagina_web: string;
  info_complementaria: string;
  estado: EstadoEnum;
  direccion?: string | null;
  latitud: number | null;
  longitud: number | null;
  ciudad_id: number | null;
  ciudad: Ciudad | null;
  created_by: string; //Agregar para vista GC
  // INICIO Limitaciones de la Gestora
  limite_cantidad_oc_activas: number | null;
  // FIN Limitaciones de la Gestora
}

export interface GestorCargaList extends GestorCarga {
  composicion_juridica_nombre: string | null;
  ciudad_nombre: string | null;
  localidad_nombre: string | null;
  moneda_nombre: string;
  pais_nombre: string | null;
  pais_nombre_corto: string | null;
  tipo_documento_descripcion: string;
}

const tipoDocumento0 = mockTipoDocumentoList[0];
const tipoDocumento1 = mockTipoDocumentoList[1];
const tipoDocumento2 = mockTipoDocumentoList[2];
const composicionJuridica0 = mockComposicionJuridicaList[0];
const composicionJuridica1 = mockComposicionJuridicaList[1];
const composicionJuridica2 = mockComposicionJuridicaList[2];
const moneda0 = mockMonedaList[0];
const moneda1 = mockMonedaList[1];

export const mockGestorCargaList: GestorCargaList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    nombre_corto: 'cargill',
    tipo_documento_id: tipoDocumento0.id,
    tipo_documento: tipoDocumento0,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica0.id,
    composicion_juridica: composicionJuridica0,
    moneda_id: moneda0.id,
    moneda: moneda0,
    logo: 'http://localhost:8103/api/bura26.png',
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    pagina_web: '',
    info_complementaria: '',
    estado: EstadoEnum.ACTIVO,
    direccion: 'CEDRALES',
    latitud: -25.658948139894708,
    longitud: -54.717514329980474,
    ciudad_id: 13,
    ciudad: mockCiudadParaguay,
    composicion_juridica_nombre: composicionJuridica0.nombre,
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    moneda_nombre: moneda0.nombre,
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento0.descripcion,
    created_by: 'admin',
    // INICIO Limitaciones de la Gestora
    limite_cantidad_oc_activas: 1,

    // FIN Limitaciones de la Gestora
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    nombre_corto: null,
    tipo_documento_id: tipoDocumento1.id,
    tipo_documento: tipoDocumento1,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica1.id,
    composicion_juridica: composicionJuridica1,
    moneda_id: moneda1.id,
    moneda: moneda1,
    logo: null,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    pagina_web: '',
    info_complementaria: '',
    estado: EstadoEnum.ACTIVO,
    direccion: 'SANTA RITA',
    latitud: -25.7917136,
    longitud: -55.08793379999997,
    ciudad_id: 7,
    ciudad: mockCiudadArgentina,
    composicion_juridica_nombre: composicionJuridica1.nombre,
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    moneda_nombre: moneda1.nombre,
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento1.descripcion,
    created_by: 'admin',
    // INICIO Limitaciones de la Gestora
    limite_cantidad_oc_activas: null,
    // FIN Limitaciones de la Gestora
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    nombre_corto: null,
    tipo_documento_id: tipoDocumento2.id,
    tipo_documento: tipoDocumento2,
    numero_documento: '800100100',
    digito_verificador: '1',
    composicion_juridica_id: composicionJuridica2.id,
    composicion_juridica: composicionJuridica2,
    moneda_id: moneda0.id,
    moneda: moneda0,
    logo: null,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    pagina_web: '',
    info_complementaria: '',
    estado: EstadoEnum.ACTIVO,
    direccion: 'GICAL KM 12',
    latitud: -25.4921592,
    longitud: -54.72833349999996,
    ciudad_id: 400,
    ciudad: mockCiudadBrasil,
    composicion_juridica_nombre: composicionJuridica2.nombre,
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    moneda_nombre: moneda1.nombre,
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    tipo_documento_descripcion: tipoDocumento2.descripcion,
    created_by: 'admin',
    // INICIO Limitaciones de la Gestora
    limite_cantidad_oc_activas: null,
    // FIN Limitaciones de la Gestora
  },
];
