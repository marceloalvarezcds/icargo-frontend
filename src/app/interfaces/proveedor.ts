import { EstadoEnum } from '../enums/estado-enum';
import { ProveedorContactoGestorCargaList, mockProveedorContactoGestorCargaList } from './proveedor-contacto-gestor-carga';
import { Ciudad } from './ciudad';
import { ComposicionJuridica, mockComposicionJuridicaList } from './composicion-juridica';
import { GestorCargaProveedor, mockGestorCargaProveedorList } from './gestor-carga-proveedor';
import { mockTipoDocumentoList, TipoDocumento } from './tipo-documento';

export interface Proveedor {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  tipo_documento_id: number;
  tipo_documento: TipoDocumento;
  numero_documento: string;
  digito_verificador: string;
  composicion_juridica_id: number;
  composicion_juridica: ComposicionJuridica;
  logo?: string | null;
  estado: EstadoEnum;
  telefono: string;
  email?: string | null;
  pagina_web?: string | null;
  direccion?: string | null;
  latitud: number;
  longitud: number;
  ciudad_id: number;
  ciudad: Ciudad;
  contactos: ProveedorContactoGestorCargaList[];
  gestor_carga_proveedor?: GestorCargaProveedor;
}

const gestorCargaProveedor0 = mockGestorCargaProveedorList[0];

const tipoDocumento0 = mockTipoDocumentoList[0];
const tipoDocumento1 = mockTipoDocumentoList[1];
const tipoDocumento2 = mockTipoDocumentoList[2];
const composicionJuridica0 = mockComposicionJuridicaList[0];
const composicionJuridica1 = mockComposicionJuridicaList[1];
const composicionJuridica2 = mockComposicionJuridicaList[2];

export interface ProveedorList extends Proveedor {
  composicion_juridica_nombre: string;
  ciudad_nombre: string;
  localidad_nombre: string;
  pais_nombre: string;
  pais_nombre_corto: string;
  tipo_documento_descripcion: string;
}

export const mockProveedorList: ProveedorList[] = [
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
    logo: 'http://localhost:8103/api/bura26.png',
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    pagina_web: 'cargill-cedrales.com',
    direccion: 'CEDRALES',
    latitud: -25.658948139894708,
    longitud: -54.717514329980474,
    ciudad_id: 13,
    ciudad: {
      id: 13,
      nombre: 'Los Cedrales',
      localidad_id: 2,
      localidad: {
        id: 2,
        nombre: 'Alto Parana',
        pais_id: 1,
        pais: {
          id: 1,
          nombre: 'Paraguay',
          nombre_corto: 'PY'
        }
      }
    },
    contactos: mockProveedorContactoGestorCargaList.slice(),
    gestor_carga_proveedor: gestorCargaProveedor0,
    composicion_juridica_nombre: composicionJuridica0.nombre,
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento0.descripcion,
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
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    pagina_web: 'adm-santa-rita.com',
    direccion: 'SANTA RITA',
    latitud: -25.7917136,
    longitud: -55.08793379999997,
    ciudad_id: 7,
    ciudad: {
      id: 7,
      nombre: 'Santa Rita',
      localidad_id: 2,
      localidad: {
        id: 2,
        nombre: 'Alto Parana',
        pais_id: 1,
        pais: {
          id: 1,
          nombre: 'Paraguay',
          nombre_corto: 'PY'
        }
      }
    },
    contactos: [],
    composicion_juridica_nombre: composicionJuridica1.nombre,
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    tipo_documento_descripcion: tipoDocumento1.descripcion,
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
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    pagina_web: 'gical-km12.com',
    direccion: 'GICAL KM 12',
    latitud: -25.4921592,
    longitud: -54.72833349999996,
    ciudad_id: 400,
    ciudad: {
      id: 400,
      nombre: 'Paso de Indios',
      localidad_id: 21,
      localidad: {
        id: 21,
        nombre: 'Chubut',
        pais_id: 2,
        pais: {
          id: 2,
          nombre: 'Argentina',
          nombre_corto: 'AR'
        }
      }
    },
    contactos: [],
    gestor_carga_proveedor: undefined,
    composicion_juridica_nombre: composicionJuridica2.nombre,
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    tipo_documento_descripcion: tipoDocumento2.descripcion,
  },
];
