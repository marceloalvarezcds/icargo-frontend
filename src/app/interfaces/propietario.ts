import { EstadoEnum } from '../enums/estado-enum';
import {
  PropietarioContactoGestorCargaList,
  mockPropietarioContactoGestorCargaList,
} from './propietario-contacto-gestor-carga';
import {
  Ciudad,
  mockCiudadArgentina,
  mockCiudadBrasil,
  mockCiudadList,
  mockCiudadParaguay,
} from './ciudad';
import { Pais, mockPaisList } from './pais';
import {
  GestorCargaPropietario,
  mockGestorCargaPropietarioList,
} from './gestor-carga-propietario';
import { mockTipoPersonaList, TipoPersona } from './tipo-persona';
import { Localidad, mockLocalidadList } from './localidad';
import { mockTipoRegistroList, TipoRegistro } from './tipo-registro';
import { mockTipoDocumentoList, TipoDocumento } from './tipo-documento';

export interface Propietario {
  id: number;
  nombre: string;
  tipo_persona_id: number;
  tipo_persona: TipoPersona;
  puede_recibir_anticipos: boolean;
  ruc: string;
  digito_verificador: string;
  pais_origen_id: number;
  pais_origen: Pais;
  fecha_nacimiento: string;
  gestor_cuenta_id?: number;
  gestor_cuenta_nombre?: string;
  oficial_cuenta_id: number;
  oficial_cuenta_nombre: string;
  foto_documento_frente: string | null;
  foto_documento_reverso?: string | null;
  foto_perfil?: string | null;
  es_chofer: boolean;
  is_propietario_condicionado: boolean;
  oc_with_anticipos_liberados: number;
  tipo_documento_propietario_id: number;
  composicion_juridica_id: number;
  /* inicio info del chofer */
  tipo_documento_id?: number;
  tipo_documento?: TipoDocumento;
  pais_emisor_documento_id?: number;
  pais_emisor_documento?: Pais;
  numero_documento?: string;
  foto_documento_frente_chofer?: string | null;
  foto_documento_reverso_chofer?: string | null;
  /* registro */
  pais_emisor_registro_id?: number;
  pais_emisor_registro?: Pais;
  localidad_emisor_registro_id?: number;
  localidad_emisor_registro?: Localidad;
  ciudad_emisor_registro_id?: number;
  ciudad_emisor_registro?: Ciudad;
  tipo_registro_id?: number;
  tipo_registro?: TipoRegistro;
  numero_registro?: string;
  vencimiento_registro?: string;
  foto_registro_frente?: string | null;
  foto_registro_reverso?: string | null;
  /* fin info del chofer */
  estado: EstadoEnum;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  ciudad_id: number;
  ciudad: Ciudad;
  alias?: string;
  contactos: PropietarioContactoGestorCargaList[];
  gestor_carga_propietario?: GestorCargaPropietario;

  promedio_propietario_gestor: number,
  promedio_propietario_general: number,
  cantidad_propietario_evaluaciones: number,
  cantidad_propietario_evaluaciones_gestor: number;
  created_by: string;
  created_at: string;
  modified_by: string;
  modified_at: string;
}

export interface PropietarioList extends Propietario {
  pais_origen_nombre: string;
  ciudad_nombre: string;
  info: string;
  localidad_nombre: string;
  foto_perfil: string | null;
  pais_nombre: string;
  pais_nombre_corto: string;
  // tipo_persona_descripcion: string;
}

const gestorCargaPropietario0 = mockGestorCargaPropietarioList[0];

const tipoPersona0 = mockTipoPersonaList[0];
const tipoPersona1 = mockTipoPersonaList[1];
const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const pais2 = mockPaisList[2];

const tipoDocumento0 = mockTipoDocumentoList[0];
const localidad0 = mockLocalidadList[0];
const ciudad0 = mockCiudadList[0];
const tipoRegistro0 = mockTipoRegistroList[0];

export const mockPropietarioList: PropietarioList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    tipo_persona_id: tipoPersona0.id,
    tipo_persona: tipoPersona0,
    puede_recibir_anticipos: false,
    ruc: '800100100',
    digito_verificador: '1',
    pais_origen_id: pais0.id,
    pais_origen: pais0,
    gestor_cuenta_id: 2,
    gestor_cuenta_nombre: 'Cargill',
    oficial_cuenta_id: 2,
    oficial_cuenta_nombre: 'Admin Cargill',
    fecha_nacimiento: '1981-06-01',
    foto_documento_frente: 'http://localhost:8103/api/bura26.png',
    foto_documento_reverso: 'http://localhost:8103/api/bura26.png',
    foto_perfil: 'http://localhost:8103/api/bura26.png',
    es_chofer: true,
    is_propietario_condicionado: false,
    oc_with_anticipos_liberados: 2,
    tipo_documento_propietario_id:2,
    composicion_juridica_id:1,
    /* inicio info del chofer */
    tipo_documento_id: tipoDocumento0.id,
    tipo_documento: tipoDocumento0,
    pais_emisor_documento_id: pais0.id,
    pais_emisor_documento: pais0,
    numero_documento: '800100100',
    foto_documento_frente_chofer: 'http://localhost:8103/api/bura26.png',
    foto_documento_reverso_chofer: 'http://localhost:8103/api/bura26.png',
    /* registro */
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
    /* fin info del chofer */
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    direccion: 'CEDRALES',
    ciudad_id: 13,
    ciudad: mockCiudadParaguay,
    contactos: mockPropietarioContactoGestorCargaList.slice(),
    gestor_carga_propietario: gestorCargaPropietario0,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    pais_origen_nombre: pais0.nombre,
    ciudad_nombre: 'Los Cedrales',
    info: 'CARGILL CEDRALES - 800100100',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    promedio_propietario_general:1,
    promedio_propietario_gestor:2,
    cantidad_propietario_evaluaciones:1,
    cantidad_propietario_evaluaciones_gestor:2,
    // tipo_persona_descripcion: tipoPersona0.descripcion,
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    tipo_persona_id: tipoPersona1.id,
    tipo_persona: tipoPersona1,
    puede_recibir_anticipos: false,
    is_propietario_condicionado: false,
    ruc: '800200200',
    digito_verificador: '1',
    pais_origen_id: pais1.id,
    pais_origen: pais1,
    gestor_cuenta_id: 1,
    composicion_juridica_id:1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-02-29',
    foto_documento_frente: null,
    foto_documento_reverso: null,
    foto_perfil: null,
    tipo_documento_propietario_id:1,
    es_chofer: false,
    oc_with_anticipos_liberados: 2,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    direccion: 'SANTA RITA',
    ciudad_id: 7,
    ciudad: mockCiudadArgentina,
    contactos: [],
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    pais_origen_nombre: pais1.nombre,
    ciudad_nombre: 'Santa Rita',
    info: 'ADM SANTA RITA - 800200200',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    promedio_propietario_general:1,
    promedio_propietario_gestor:2,
    cantidad_propietario_evaluaciones:1,
    cantidad_propietario_evaluaciones_gestor:2,
    // tipo_persona_descripcion: tipoPersona1.descripcion,
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    tipo_persona_id: tipoPersona0.id,
    tipo_persona: tipoPersona0,
    puede_recibir_anticipos: false,
    is_propietario_condicionado: false,
    ruc: '800300300',
    digito_verificador: '1',
    tipo_documento_propietario_id:2,
    pais_origen_id: pais2.id,
    composicion_juridica_id:1,
    pais_origen: pais2,
    gestor_cuenta_id: 1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-06-01',
    foto_documento_frente: null,
    foto_documento_reverso: null,
    foto_perfil: null,
    es_chofer: false,
    oc_with_anticipos_liberados: 2,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    direccion: 'GICAL KM 12',
    ciudad_id: 400,
    ciudad: mockCiudadBrasil,
    contactos: [],
    gestor_carga_propietario: undefined,
    created_by: 'system',
    created_at: '2021-11-30T20:38:09.553757',
    modified_by: 'system',
    modified_at: '2021-11-30T20:38:09.553757',
    pais_origen_nombre: pais2.nombre,
    ciudad_nombre: 'Paso de Indios',
    info: 'GICAL KM12 - 800300300',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    promedio_propietario_general:1,
    promedio_propietario_gestor:2,
    cantidad_propietario_evaluaciones:1,
    cantidad_propietario_evaluaciones_gestor:2,
    // tipo_persona_descripcion: tipoPersona0.descripcion,
  },
];
