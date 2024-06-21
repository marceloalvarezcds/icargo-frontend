import { EstadoEnum } from '../enums/estado-enum';
import { CentroOperativoClasificacion } from './centro-operativo-clasificacion';
import {
  CentroOperativoContactoGestorCargaList,
  mockCentroOperativoContactoGestorCargaList,
} from './centro-operativo-contacto-gestor-carga';
import {
  Ciudad,
  mockCiudadArgentina,
  mockCiudadBrasil,
  mockCiudadParaguay,
} from './ciudad';
import {
  GestorCargaCentroOperativo,
  mockGestorCargaCentroOperativoList,
} from './gestor-carga-centro-operativo';

export interface CentroOperativo {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  logo?: string | null;
  estado: EstadoEnum;
  telefono: string;
  email?: string | null;
  pagina_web?: string | null;
  direccion?: string | null;
  latitud: number | null;
  longitud: number | null;
  clasificacion_id: number;
  clasificacion: CentroOperativoClasificacion;
  ciudad_id: number | null;
  ciudad: Ciudad | null;
  contactos: CentroOperativoContactoGestorCargaList[];
  gestor_carga_centro_operativo?: GestorCargaCentroOperativo;
  
}

const gestorCargaCentroOperativo0 = mockGestorCargaCentroOperativoList[0];

export interface CentroOperativoList extends CentroOperativo {
  clasificacion_nombre: string;
  ciudad_nombre: string | null;
  localidad_nombre: string | null;
  pais_nombre: string | null;
  pais_nombre_corto: string | null;
  created_by: string; //Agregar para vista CO
}

export const mockCentroOperativoList: CentroOperativoList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    nombre_corto: 'cargill',
    logo: 'http://localhost:8103/api/bura26.png',
    estado: EstadoEnum.ACTIVO,
    telefono: '0982444444',
    email: 'contacto@cargill-cedrales.com',
    pagina_web: 'cargill-cedrales.com',
    direccion: 'CEDRALES',
    latitud: -25.658948139894708,
    longitud: -54.717514329980474,
    clasificacion_id: 1,
    clasificacion: {
      id: 1,
      nombre: 'Silo',
      estado: EstadoEnum.ACTIVO,
    },
    ciudad_id: 13,
    ciudad: mockCiudadParaguay,
    contactos: mockCentroOperativoContactoGestorCargaList.slice(),
    gestor_carga_centro_operativo: gestorCargaCentroOperativo0,
    clasificacion_nombre: 'Silo',
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    created_by: 'admin',
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    nombre_corto: null,
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981111111',
    email: 'contacto@adm-santa-rita.com',
    pagina_web: 'adm-santa-rita.com',
    direccion: 'SANTA RITA',
    latitud: -25.7917136,
    longitud: -55.08793379999997,
    clasificacion_id: 2,
    clasificacion: {
      id: 2,
      nombre: 'Puerto seco',
      estado: EstadoEnum.ACTIVO,
    },
    ciudad_id: 7,
    ciudad: mockCiudadArgentina,
    contactos: [],
    clasificacion_nombre: 'Puerto seco',
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
    created_by: 'admin',
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    nombre_corto: null,
    logo: null,
    estado: EstadoEnum.ACTIVO,
    telefono: '0981222222',
    email: 'contacto@gical-km12.com',
    pagina_web: 'gical-km12.com',
    direccion: 'GICAL KM 12',
    latitud: -25.4921592,
    longitud: -54.72833349999996,
    clasificacion_id: 3,
    clasificacion: {
      id: 3,
      nombre: 'Puerto multimodal',
      estado: EstadoEnum.ACTIVO,
    },
    ciudad_id: 400,
    ciudad: mockCiudadBrasil,
    contactos: [],
    gestor_carga_centro_operativo: undefined,
    clasificacion_nombre: 'Puerto multimodal',
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
    created_by: 'admin',
  },
];
