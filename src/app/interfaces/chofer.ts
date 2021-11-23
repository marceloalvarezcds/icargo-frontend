import { EstadoEnum } from '../enums/estado-enum';
import { Ciudad } from './ciudad';
import { GestorCargaChofer, mockGestorCargaChoferList } from './gestor-carga-chofer';
import { mockPaisList, Pais } from './pais';

export interface Chofer {
  id: number;
  nombre: string;
  alias?: string;
  documento_identidad: string;
  ruc: string;
  digito_verificador: string;
  pais_origen_id: number;
  pais_origen: Pais;
  fecha_nacimiento: string;
  gestor_cuenta_id?: number;
  gestor_cuenta_nombre?: string;
  oficial_cuenta_id: number;
  oficial_cuenta_nombre: string;
  foto_documento?: string | null;
  foto_perfil?: string | null;
  es_propietario: boolean;
  estado: EstadoEnum;
  telefono: string;
  email?: string | null;
  direccion?: string | null;
  ciudad_id: number;
  ciudad: Ciudad;
  gestor_carga_chofer?: GestorCargaChofer;
}

export interface ChoferList extends Chofer {
  pais_origen_nombre: string;
  ciudad_nombre: string;
  localidad_nombre: string;
  pais_nombre: string;
  pais_nombre_corto: string;
}

const gestorCargaChofer0 = mockGestorCargaChoferList[0];

const pais0 = mockPaisList[0];
const pais1 = mockPaisList[1];
const pais2 = mockPaisList[2];

export const mockChoferList: ChoferList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    documento_identidad: '3100100',
    ruc: '800100100',
    digito_verificador: '1',
    pais_origen_id: pais0.id,
    pais_origen: pais0,
    gestor_cuenta_id: 2,
    gestor_cuenta_nombre: 'Cargill',
    oficial_cuenta_id: 2,
    oficial_cuenta_nombre: 'Admin Cargill',
    fecha_nacimiento: '1981-06-01',
    foto_documento: 'http://localhost:8103/api/bura26.png',
    foto_perfil: 'http://localhost:8103/api/bura26.png',
    es_propietario: true,
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    direccion: 'CEDRALES',
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
    gestor_carga_chofer: gestorCargaChofer0,
    pais_origen_nombre: pais0.nombre,
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    documento_identidad: '3100100',
    ruc: '800100100',
    digito_verificador: '1',
    pais_origen_id: pais1.id,
    pais_origen: pais1,
    gestor_cuenta_id: 1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-02-29',
    foto_documento: null,
    foto_perfil: null,
    es_propietario: false,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    direccion: 'SANTA RITA',
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
    pais_origen_nombre: pais1.nombre,
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    documento_identidad: '3100100',
    ruc: '800100100',
    digito_verificador: '1',
    pais_origen_id: pais2.id,
    pais_origen: pais2,
    gestor_cuenta_id: 1,
    gestor_cuenta_nombre: 'Transred',
    oficial_cuenta_id: 1,
    oficial_cuenta_nombre: 'Admin Transred',
    fecha_nacimiento: '1981-06-01',
    foto_documento: null,
    foto_perfil: null,
    es_propietario: false,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    direccion: 'GICAL KM 12',
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
    gestor_carga_chofer: undefined,
    pais_origen_nombre: pais2.nombre,
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
  },
];
