import { EstadoEnum } from '../enums/estado-enum';
import { Ciudad } from './ciudad';

export interface GestorCarga {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  logo?: string | null;
  estado: EstadoEnum;
  direccion?: string | null;
  latitud: number;
  longitud: number;
  ciudad_id: number;
  ciudad: Ciudad;
}

export interface GestorCargaList extends GestorCarga {
  clasificacion_nombre: string;
  ciudad_nombre: string;
  localidad_nombre: string;
  pais_nombre: string;
  pais_nombre_corto: string;
}

export const mockGestorCargaList: GestorCargaList[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    nombre_corto: 'cargill',
    logo: 'http://localhost:8103/api/bura26.png',
    estado: EstadoEnum.ACTIVO,
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
    clasificacion_nombre: 'Silo',
    ciudad_nombre: 'Los Cedrales',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    nombre_corto: null,
    logo: null,
    estado: EstadoEnum.ACTIVO,
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
    clasificacion_nombre: 'Puerto seco',
    ciudad_nombre: 'Santa Rita',
    localidad_nombre: 'Alto Parana',
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    nombre_corto: null,
    logo: null,
    estado: EstadoEnum.ACTIVO,
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
    clasificacion_nombre: 'Puerto multimodal',
    ciudad_nombre: 'Paso de Indios',
    localidad_nombre: 'Chubut',
    pais_nombre: 'Argentina',
    pais_nombre_corto: 'AR',
  },
];
