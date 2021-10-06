import { CentroOperativoClasificacion } from './centro-operativo-clasificacion';
import { Ciudad } from './ciudad';
import { Contacto } from './contacto';

export interface CentroOperativo {
  id: number;
  nombre: string;
  nombre_corto?: string | null;
  logo?: string | null;
  es_moderado: boolean;
  direccion?: string | null;
  latitud: number;
  longitud: number;
  clasificacion_id: number;
  clasificacion: CentroOperativoClasificacion;
  ciudad_id: number;
  ciudad: Ciudad;
  contacto_id?: number | null;
  contacto?: Contacto | null;
}

export const mockCentroOperativoList: CentroOperativo[] = [
  {
    id: 1,
    nombre: 'CARGILL CEDRALES',
    nombre_corto: null,
    logo: null,
    es_moderado: true,
    direccion: 'CEDRALES',
    latitud: -25.658948139894708,
    longitud: -54.717514329980474,
    clasificacion_id: 1,
    clasificacion: {
      id: 1,
      nombre: 'Silo',
      es_moderado: true
    },
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
    contacto_id: null,
    contacto: null
  },
  {
    id: 2,
    nombre: 'ADM SANTA RITA',
    nombre_corto: null,
    logo: null,
    es_moderado: true,
    direccion: 'SANTA RITA',
    latitud: -25.7917136,
    longitud: -55.08793379999997,
    clasificacion_id: 2,
    clasificacion: {
      id: 2,
      nombre: 'Puerto seco',
      es_moderado: true
    },
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
    contacto_id: null,
    contacto: null
  },
  {
    id: 3,
    nombre: 'GICAL KM12',
    nombre_corto: null,
    logo: null,
    es_moderado: true,
    direccion: 'GICAL KM 12',
    latitud: -25.4921592,
    longitud: -54.72833349999996,
    clasificacion_id: 3,
    clasificacion: {
      id: 3,
      nombre: 'Puerto multimodal',
      es_moderado: true
    },
    ciudad_id: 400,
    ciudad: {
      id: 400,
      nombre: "Paso de Indios",
      localidad_id: 21,
      localidad: {
        id: 21,
        nombre: "Chubut",
        pais_id: 2,
        pais: {
          id: 2,
          nombre: "Argentina",
          nombre_corto: "AR"
        }
      }
    },
    contacto_id: null,
    contacto: null
  },
];
