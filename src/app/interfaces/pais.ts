export interface Pais {
  id: number;
  nombre: string;
  nombre_corto: string;
}

export const mockPaisList: Pais[] = [
  {
    id: 1,
    nombre: 'Paraguay',
    nombre_corto: 'PY'
  },
  {
    id: 2,
    nombre: 'Argentina',
    nombre_corto: 'AR',
  },
  {
    id: 3,
    nombre: 'Brasil',
    nombre_corto: 'BR',
  },
];
