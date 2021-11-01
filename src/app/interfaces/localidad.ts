import { Pais } from "./pais";

export interface Localidad {
  id: number;
  nombre: string;
  pais_id: number;
  pais: Pais
}

export const mockLocalidadList: Localidad[] = [
  {
    id: 2,
    nombre: 'Alto Parana',
    pais_id: 1,
    pais: {
      id: 1,
      nombre: 'Paraguay',
      nombre_corto: 'PY',
    },
  },
  {
    id: 21,
    nombre: 'Chubut',
    pais_id: 2,
    pais: {
      id: 2,
      nombre: 'Argentina',
      nombre_corto: 'AR',
    },
  },
];
