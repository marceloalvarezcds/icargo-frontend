export interface Ciudad {
  id: number;
  nombre: string;
  localidad_id: number;
  localidad_nombre: string;
  pais_id: number;
  pais_nombre: string;
  pais_nombre_corto: string;
  estado?: string;
}

export const mockCiudadParaguay: Ciudad = {
  id: 13,
  nombre: 'Los Cedrales',
  localidad_id: 2,
  localidad_nombre: 'Alto Parana',
  pais_id: 1,
  pais_nombre: 'Paraguay',
  pais_nombre_corto: 'PY',
};

export const mockCiudadArgentina: Ciudad = {
  id: 400,
  nombre: 'Paso de Indios',
  localidad_id: 21,
  localidad_nombre: 'Chubut',
  pais_id: 2,
  pais_nombre: 'Argentina',
  pais_nombre_corto: 'AR',
};

export const mockCiudadBrasil: Ciudad = {
  id: 5097,
  nombre: 'Florianopolis',
  localidad_id: 21,
  localidad_nombre: 'São Paulo',
  pais_id: 2,
  pais_nombre: 'Brasil',
  pais_nombre_corto: 'BR',
};

export const mockCiudadList: Ciudad[] = [
  mockCiudadParaguay,
  {
    id: 7,
    nombre: 'Santa Rita',
    localidad_id: 2,
    localidad_nombre: 'Alto Parana',
    pais_id: 1,
    pais_nombre: 'Paraguay',
    pais_nombre_corto: 'PY',
  },
  mockCiudadArgentina,
  mockCiudadBrasil,
];
