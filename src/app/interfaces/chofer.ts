import { EstadoEnum } from '../enums/estado-enum';
import {
  Ciudad,
  mockCiudadArgentina,
  mockCiudadBrasil,
  mockCiudadList,
  mockCiudadParaguay,
} from './ciudad';
import {
  GestorCargaChofer,
  mockGestorCargaChoferList,
} from './gestor-carga-chofer';
import { Localidad, mockLocalidadList } from './localidad';
import { mockPaisList, Pais } from './pais';
import { mockTipoRegistroList, TipoRegistro } from './tipo-registro';
import { mockTipoDocumentoList, TipoDocumento } from './tipo-documento';

export interface Chofer {
  id: number;
  nombre: string;
  tipo_documento_id: number;
  tipo_documento: TipoDocumento;
  pais_emisor_documento_id: number;
  pais_emisor_documento: Pais;
  numero_documento: string;
  puede_recibir_anticipos: boolean;
  ruc: string;
  digito_verificador: string | null;
  fecha_nacimiento: string | null;
  gestor_cuenta_id?: number;
  gestor_cuenta_nombre?: string;
  oficial_cuenta_id: number;
  oficial_cuenta_nombre: string;
  foto_documento_frente?: string | null;
  foto_documento_reverso?: string | null;
  foto_perfil?: string | null;
  es_propietario: boolean;
  /* Datos del Propietario */
  pais_origen_id?: number | null;
  pais_origen?: Pais | null;
  foto_documento_frente_propietario?: string | null;
  foto_documento_reverso_propietario?: string | null;
  /* inicio registro */
  pais_emisor_registro_id: number;
  pais_emisor_registro: Pais;
  localidad_emisor_registro_id: number;
  localidad_emisor_registro: Localidad;
  ciudad_emisor_registro_id: number;
  ciudad_emisor_registro: Ciudad;
  tipo_registro_id: number | null;
  tipo_registro: TipoRegistro | null;
  numero_registro: string;
  vencimiento_registro: string;
  foto_registro_frente?: string | null;
  foto_registro_reverso?: string | null;
  /* fin registro */
  estado: EstadoEnum;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  ciudad_id: number | null;
  ciudad: Ciudad | null;
  alias?: string;
  gestor_carga_chofer?: GestorCargaChofer;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface ChoferList extends Chofer {
  pais_emisor_documento_nombre: string;
  ciudad_nombre: string | null;
  localidad_nombre: string | null;
  pais_nombre: string | null;
  pais_nombre_corto: string | null;
  tipo_documento_descripcion: string;
}

const gestorCargaChofer0 = mockGestorCargaChoferList[0];

const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const pais2 = mockPaisList[2];

const localidad0 = mockLocalidadList[0];
const localidad1 = mockLocalidadList[1];
const localidad2 = mockLocalidadList[2];

const ciudad0 = mockCiudadList[0];
const ciudad1 = mockCiudadList[2];
const ciudad2 = mockCiudadList[3];

const tipoDocumento0 = mockTipoDocumentoList[0];
const tipoDocumento1 = mockTipoDocumentoList[1];
const tipoDocumento2 = mockTipoDocumentoList[2];

const tipoRegistro0 = mockTipoRegistroList[0];
const tipoRegistro1 = mockTipoRegistroList[1];

export const mockChoferList: ChoferList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    tipo_documento_id: tipoDocumento0.id,
    tipo_documento: tipoDocumento0,
    pais_emisor_documento_id: pais0.id,
    pais_emisor_documento: pais0,
    numero_documento: '800100100',
    puede_recibir_anticipos: false,
    ruc: '800100100',
    digito_verificador: '1',
    gestor_cuenta_id: 2,
    gestor_cuenta_nombre: 'Cargill',
    oficial_cuenta_id: 2,
    oficial_cuenta_nombre: 'Admin Cargill',
    fecha_nacimiento: '1981-06-01',
    foto_documento_frente: 'http://localhost:8103/api/bura26.png',
    foto_documento_reverso: 'http://localhost:8103/api/bura26.png',
    foto_perfil: 'http://localhost:8103/api/bura26.png',
    es_propietario: true,
    /* Datos del Propietario */
    pais_origen_id: pais0.id,
    pais_origen: pais0,
    foto_documento_frente_propietario: 'http://localhost:8103/api/bura26.png',
    foto_documento_reverso_propietario: 'http://localhost:8103/api/bura26.png',
    /* inicio registro */
    pais_emisor_registro_id: pais0.id,
    pais_emisor_registro: pais0,
    localidad_emisor_registro_id: localidad0.id,
    localidad_emisor_registro: localidad0,
    ciudad_emisor_registro_id: ciudad0.id,
    ciudad_emisor_registro: ciudad0,
    tipo_registro_id: tipoRegistro0.id,
    tipo_registro: tipoRegistro0,
    numero_registro: 'aaabbb',
    vencimiento_registro: '1981-06-01',
    foto_registro_frente: 'http://localhost:8103/api/bura26.png',
    foto_registro_reverso: 'http://localhost:8103/api/bura26.png',
    /* fin registro */
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    direccion: 'CEDRALES',
    ciudad_id: 13,
    ciudad: mockCiudadParaguay,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    gestor_carga_chofer: gestorCargaChofer0,
    pais_emisor_documento_nombre: pais0.nombre,
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento0.descripcion,
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    tipo_documento_id: tipoDocumento1.id,
    tipo_documento: tipoDocumento1,
    pais_emisor_documento_id: pais1.id,
    pais_emisor_documento: pais1,
    numero_documento: '800100100',
    puede_recibir_anticipos: false,
    ruc: '800100100',
    digito_verificador: '1',
    gestor_cuenta_id: 1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-02-29',
    foto_documento_frente: null,
    foto_documento_reverso: null,
    foto_perfil: null,
    es_propietario: false,
    /* inicio registro */
    pais_emisor_registro_id: pais1.id,
    pais_emisor_registro: pais1,
    localidad_emisor_registro_id: localidad1.id,
    localidad_emisor_registro: localidad1,
    ciudad_emisor_registro_id: ciudad1.id,
    ciudad_emisor_registro: ciudad1,
    tipo_registro_id: tipoRegistro1.id,
    tipo_registro: tipoRegistro1,
    numero_registro: 'cccddd',
    vencimiento_registro: '1981-02-29',
    foto_registro_frente: null,
    foto_registro_reverso: null,
    /* fin registro */
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    direccion: 'SANTA RITA',
    ciudad_id: 7,
    ciudad: mockCiudadArgentina,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    pais_emisor_documento_nombre: pais1.nombre,
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento1.descripcion,
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    tipo_documento_id: tipoDocumento2.id,
    tipo_documento: tipoDocumento2,
    pais_emisor_documento_id: pais2.id,
    pais_emisor_documento: pais2,
    numero_documento: '800100100',
    puede_recibir_anticipos: false,
    ruc: '800100100',
    digito_verificador: '1',
    gestor_cuenta_id: 1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-06-01',
    foto_documento_frente: null,
    foto_documento_reverso: null,
    foto_perfil: null,
    es_propietario: false,
    /* inicio registro */
    pais_emisor_registro_id: pais2.id,
    pais_emisor_registro: pais2,
    localidad_emisor_registro_id: localidad2.id,
    localidad_emisor_registro: localidad2,
    ciudad_emisor_registro_id: ciudad2.id,
    ciudad_emisor_registro: ciudad2,
    tipo_registro_id: tipoRegistro0.id,
    tipo_registro: tipoRegistro0,
    numero_registro: 'eeefff',
    vencimiento_registro: '1981-06-01',
    foto_registro_frente: null,
    foto_registro_reverso: null,
    /* fin registro */
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    direccion: 'GICAL KM 12',
    ciudad_id: 400,
    ciudad: mockCiudadBrasil,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    gestor_carga_chofer: undefined,
    pais_emisor_documento_nombre: pais2.nombre,
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    tipo_documento_descripcion: tipoDocumento2.descripcion,
  },
];
