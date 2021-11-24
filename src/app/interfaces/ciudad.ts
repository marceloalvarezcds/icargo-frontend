import { Localidad } from "./localidad";

export interface Ciudad {
  id: number;
  nombre: string;
  localidad_id: Number;
  localidad: Localidad;
}

export const mockCiudadList: Ciudad[] = [
  {
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
  {
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
  {
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
  {
    id: 5097,
    nombre: 'Florianopolis',
    localidad_id: 21,
    localidad: {
      id: 64,
      nombre: 'São Paulo',
      pais_id: 2,
      pais: {
        id: 3,
        nombre: 'Brasil',
        nombre_corto: 'BR',
      },
    },
  },
];
